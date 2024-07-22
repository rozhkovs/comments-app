import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import {
  persistReducer,
  persistStore,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';

import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './auth';
import commentReducer from './comment';

// region exports from imports
export { signUp, signOut, getCurUserSelector } from './auth';
export {
  loadNextPageComments,
  createComment,
  startWritingNewComment,
  cancelWritingNewComment,
  commentReplyingIdsSelector,
  commentsSelector,
  sortedCascadeCommentsSelector,
  allowLoadCommentNextPageSelector,
  isCommentListRefreshingSelector,
  visibleCommentFooterLoaderSelector,
} from './comment';
// endregion

const persistedAuthReducer = persistReducer(
  {
    key: 'auth',
    storage: AsyncStorage,
  },
  authReducer,
);

const rootReducer = {
  auth: persistedAuthReducer,
  comment: commentReducer,
};

const store = configureStore({
  reducer: rootReducer,
  devTools: false,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  enhancers: (getDefaultEnhancers) => {
    if (process.env.NODE_ENV !== 'production') {
      const { default: reactotron } = require('@/shared/reactotron');
      return getDefaultEnhancers().concat(reactotron.createEnhancer());
    }
    return getDefaultEnhancers();
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export default store;

export const persistor = persistStore(store);
