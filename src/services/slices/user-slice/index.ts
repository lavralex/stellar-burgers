import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  TRegisterData
} from '@api';
import { setCookie, getCookie, deleteCookie } from '../../../utils/cookie';

interface UserState {
  data: { email: string; name: string } | null;
  isLoading: boolean;
  isAuthChecked: boolean;
  error: string | null;
}

export const initialState: UserState = {
  data: null,
  isLoading: false,
  isAuthChecked: false,
  error: null
};

export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      dispatch(getUser());
    } else {
      dispatch(setAuthChecked());
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await loginUserApi({ email, password });
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async ({
    email,
    password,
    name
  }: {
    email: string;
    password: string;
    name: string;
  }) => {
    const response = await registerUserApi({ email, password, name });
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const getUser = createAsyncThunk('user/getUser', getUserApi);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (userData: Partial<TRegisterData>) => {
    const response = await updateUserApi(userData);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.fulfilled, (state) => {
        state.isAuthChecked = true;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка авторизации';
        state.isAuthChecked = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.data = action.payload.user;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.isAuthChecked = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.data = null;
      });
  },
  selectors: {
    getUserData: (state) => state.data,
    getUserLoading: (state) => state.isLoading,
    getAuthChecked: (state) => state.isAuthChecked,
    getUserError: (state) => state.error,
    getName: (state) => state.data?.name || '',
    getEmail: (state) => state.data?.email || ''
  }
});

export const { setAuthChecked } = userSlice.actions;
export const {
  getUserData,
  getUserLoading,
  getAuthChecked,
  getUserError,
  getName,
  getEmail
} = userSlice.selectors;
export default userSlice.reducer;
