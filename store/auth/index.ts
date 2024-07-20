import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  UserCreateDbModel,
  UserDbModel,
  userRepository,
} from '@/shared/database';
import { RootState } from '@/store';

export type User = UserDbModel;

const initialState: {
  user: User | null;
} = {
  user: null,
};

export type UserSignUp = UserCreateDbModel;

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (payload: UserSignUp) => {
    // TODO ??? добавить дополнительную валидацию
    const userId = await userRepository.create(payload);
    // TODO ??? проверить то, что нет дубликатов по почте.
    return (await userRepository.getById(userId))!;
  },
);

export const signOut = createAsyncThunk('auth/signOut', async () => {});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(signUp.fulfilled, (state, { payload }) => {
      state.user = payload;
    });
    builder.addCase(signOut.fulfilled, (state) => {
      state.user = null;
    });
  },
});

export const getCurUserSelector = (state: RootState) => state.auth.user;

export default authSlice.reducer;
