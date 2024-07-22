import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { FlatList, KeyboardAvoidingView, ListRenderItem } from 'react-native';
import { createSelector } from 'reselect';
import {
  allowLoadCommentNextPageSelector,
  commentReplyingIdsSelector,
  commentsSelector,
  isCommentListRefreshingSelector,
  loadNextPageComments,
  sortedCascadeCommentsSelector,
  useAppDispatch,
  useAppSelector,
  visibleCommentFooterLoaderSelector,
} from '@/store';
import { Platform } from 'expo-modules-core';
import { Comment } from '@/store/comment';
import { ListFooter } from '@/shared/ui-kit/core';
import { useHeaderHeight } from '@react-navigation/elements';
import { useStableCallback } from '@/shared/utils/react-useful-hooks';
import CommentCreateListItem from '@/widgets/comment/CommentCreateListItem';
import CommentListItem from './CommentListItem';

const ConnectedListFooter = memo(() => {
  const isLoading = useAppSelector(visibleCommentFooterLoaderSelector);
  return <ListFooter loading={isLoading} />;
});

type ListItem =
  | {
      type: 'data';
      data: Comment;
    }
  | {
      type: 'new';
      replyParentId: Comment['replyParentId'];
    };

const keyExtractor = (item: ListItem) =>
  item.type === 'new' ? `new_${item.replyParentId}` : item.data.id.toString();

const createListItemsSelector = () =>
  createSelector(
    sortedCascadeCommentsSelector,
    commentReplyingIdsSelector,
    (comments, replyingIds): ListItem[] => {
      const result: ListItem[] = [];

      const tryPushReplyingComments = (
        replyParentId: Comment['replyParentId'],
      ) => {
        replyingIds
          .filter((id) => id === replyParentId)
          .forEach(() =>
            result.push({ type: 'new', replyParentId: replyParentId }),
          );
      };

      tryPushReplyingComments(null);
      comments.forEach((comment) => {
        result.push({ type: 'data', data: comment });
        tryPushReplyingComments(comment.id);
      });

      return result;
    },
  );

const CommentList = () => {
  const comments = useAppSelector(commentsSelector);
  const isRefreshing = useAppSelector(isCommentListRefreshingSelector);
  const isLoading = useAppSelector(visibleCommentFooterLoaderSelector);
  const allowNextLoad = useAppSelector(allowLoadCommentNextPageSelector);
  const listItemsSelector = useMemo(createListItemsSelector, []);
  const listItems = useAppSelector(listItemsSelector);
  const dispatch = useAppDispatch();
  const headerHeight = useHeaderHeight();

  const loadNext = useStableCallback(() => {
    if (isRefreshing || isLoading || !allowNextLoad) {
      return;
    }
    dispatch(loadNextPageComments());
  });

  const getNestedLevel = useCallback(
    (id: Comment['replyParentId'], acc: number = 0): number => {
      const parentComment = comments.find((comment) => comment.id === id);
      return parentComment
        ? getNestedLevel(parentComment.replyParentId, acc + 1)
        : acc;
    },
    [comments],
  );

  const renderItem: ListRenderItem<ListItem> = useCallback(
    ({ item }) => {
      if (item.type === 'new') {
        return <CommentCreateListItem replyParentId={item.replyParentId} />;
      }
      const comment = item.data;

      // можно было бы просто передавать comment.id, а дальше получить все необходимые данные.
      return (
        <CommentListItem
          id={comment.id}
          userName={comment.user.name}
          message={comment.message}
          createdAt={comment.createdAt}
          nestedLevel={getNestedLevel(comment.replyParentId)}
        />
      );
    },
    [getNestedLevel],
  );

  // Initialize loading
  useEffect(() => {
    loadNext();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined} // undefined corrects flickering from the bottom of the flatlist when you navigate from the SignUp page, provided that the keyboard is active
      keyboardVerticalOffset={headerHeight}>
      <FlatList
        data={listItems}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        refreshing={isRefreshing}
        onEndReached={loadNext}
        ListFooterComponent={ConnectedListFooter}
        keyboardShouldPersistTaps={'handled'}
        removeClippedSubviews={false} // fix flickering https://stackoverflow.com/questions/67615563/tapping-a-textinput-in-the-bottom-of-the-flatlist-the-keyboard-immediately-close
      />
    </KeyboardAvoidingView>
  );
};

export default memo(CommentList);
