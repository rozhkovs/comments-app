import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
  EntityState,
} from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { WritableDraft } from 'immer';
import {
  CommentCreateDbModel,
  CommentDbModel,
  commentRepository,
} from '@/shared/database';
import createAppAsyncThunk from '@/store/create-app-async-thunk';
import { RequestStatus } from '@/store/common-types';
import { RootState } from '@/store';

const PER_PAGE = 25;

export type Comment = CommentDbModel;

const commentsAdapter = createEntityAdapter<Comment>();

const initialState: {
  new: {
    replyingIds: Comment['replyParentId'][];
  };
  list: EntityState<Comment, Comment['id']> & {
    nextPage: number;
    isEnd: boolean;
    requestStatus: RequestStatus;
  };
} = {
  new: {
    replyingIds: [] as Comment['replyParentId'][],
  },
  list: commentsAdapter.getInitialState({
    nextPage: 0,
    isEnd: false,
    requestStatus: 'idle',
  }),
};

export type CommentCreate = CommentCreateDbModel;

export const createComment = createAppAsyncThunk(
  'comment/createComment',
  async (payload: CommentCreate) => {
    const id = await commentRepository.create(payload);
    return (await commentRepository.getById(id))!;
  },
);

export const loadNextPageComments = createAppAsyncThunk(
  'comment/loadNextPageComments',
  async (_, { getState }) => {
    const { nextPage } = getState().comment.list;
    return await commentRepository.getCascadeList({
      page: nextPage,
      perPage: PER_PAGE,
    });
  },
);

const prepareCancelWritingNewComment = (
  state: WritableDraft<typeof initialState>,
  { payload }: Pick<PayloadAction<Comment['replyParentId']>, 'payload'>,
) => {
  const index = state.new.replyingIds.indexOf(payload);
  if (index > -1) {
    state.new.replyingIds.splice(index, 1);
  }
};

const commentsSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    startWritingNewComment: (
      state,
      { payload }: PayloadAction<Comment['replyParentId']>,
    ) => {
      if (!state.new.replyingIds.includes(payload)) {
        state.new.replyingIds.push(payload);
      }
    },
    cancelWritingNewComment: prepareCancelWritingNewComment,
  },
  extraReducers: (builder) => {
    builder.addCase(loadNextPageComments.pending, (state, { meta }) => {
      state.list.requestStatus = meta.requestStatus;
    });
    builder.addCase(
      loadNextPageComments.fulfilled,
      (state, { payload, meta }) => {
        if (payload.length < PER_PAGE) {
          state.list.isEnd = true;
        }
        state.list.nextPage++;
        state.list.requestStatus = meta.requestStatus;
        commentsAdapter.addMany(state.list, payload);
      },
    );
    builder.addCase(loadNextPageComments.rejected, (state, { meta }) => {
      state.list.requestStatus = meta.requestStatus;
      // TODO ??? как обрабатываем?
    });

    builder.addCase(createComment.fulfilled, (state, { payload }) => {
      commentsAdapter.addOne(state.list, payload);
      prepareCancelWritingNewComment(state, { payload: payload.replyParentId });
    });
  },
});

const commentSelectors = commentsAdapter.getSelectors(
  (state: RootState) => state.comment.list,
);

export const commentReplyingIdsSelector = (state: RootState) =>
  state.comment.new.replyingIds;

export const commentsSelector = commentSelectors.selectAll;

// !!! Потенциальное узкое место по выполнению. Можно раньше парсить числа.
export const sortedCascadeCommentsSelector = createSelector(
  commentsSelector,
  (comments) => {
    const result: Comment[] = [];
    const sortCascade = (parentId: Comment['replyParentId']) => {
      const lvlComments = comments.filter((c) => c.replyParentId === parentId);
      const sortedLvlComments = lvlComments.sort((a, b) =>
        new Date(a.createdAt) > new Date(b.createdAt) ? 1 : -1,
      );
      sortedLvlComments.forEach((c) => {
        result.push(c);
        sortCascade(c.id);
      });
    };
    sortCascade(null);

    return result;
  },
);

const isListEmpty = (state: RootState) => commentsSelector(state).length <= 0;
const isListLoading = (state: RootState) =>
  state.comment.list.requestStatus === 'pending';
export const isCommentListRefreshingSelector = (state: RootState) =>
  isListEmpty(state) && isListLoading(state);
export const visibleCommentFooterLoaderSelector = (state: RootState) =>
  !isListEmpty(state) && isListLoading(state);
export const allowLoadCommentNextPageSelector = (state: RootState) =>
  !state.comment.list.isEnd;

export const { startWritingNewComment, cancelWritingNewComment } =
  commentsSlice.actions;

export default commentsSlice.reducer;
