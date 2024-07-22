import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from './index';

const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
}>();

export default createAppAsyncThunk;
