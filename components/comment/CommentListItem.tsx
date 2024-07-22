import React, { memo } from 'react';
import { View } from 'react-native';
import dayjs from 'dayjs';
import { Text, Icon, makeStyles } from '@/components/ui-kit/core';
import { startWritingNewComment, useAppDispatch } from '@/store';
import { useStableCallback } from '@/shared/utils/react-useful-hooks';

const LEVEL_PADDING = 16;
const START_LEFT_PADDING = LEVEL_PADDING;

type CommentListItemProps = {
  id: number;
  message: string;
  userName: string;
  nestedLevel: number;
  createdAt: string;
};

const CommentListItem = ({
  id,
  message,
  nestedLevel,
  userName,
  createdAt,
}: CommentListItemProps) => {
  const dispatch = useAppDispatch();
  const styles = useStyle();
  const paddingLeft = START_LEFT_PADDING + nestedLevel * LEVEL_PADDING;

  const startReplying = useStableCallback(() => {
    dispatch(startWritingNewComment(id));
  });

  return (
    <View style={[styles.container, { paddingLeft }]}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerUserName}>{userName}</Text>
        <Icon name="reply" type="material" onPress={startReplying} />
        <Text style={styles.headerCreatedAt}>
          {dayjs(createdAt).format('LLL')}
        </Text>
      </View>
      <Text style={styles.body}>{message}</Text>
    </View>
  );
};

const useStyle = makeStyles((theme) => ({
  container: {
    paddingHorizontal: LEVEL_PADDING,
    paddingVertical: 8,
    marginVertical: 4,
  },
  headerContainer: {
    backgroundColor: theme.colors.grey5,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
    flexWrap: 'wrap',
    minHeight: 40,
  },
  headerUserName: {
    fontSize: 18,
  },
  headerCreatedAt: {
    color: theme.colors.secondary,
    fontSize: 13,
  },
  body: {
    padding: 4,
  },
}));

export default memo(CommentListItem);
