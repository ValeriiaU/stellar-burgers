import {
  registerUserApi,
  TLoginData,
  TRegisterData,
  loginUserApi,
  logoutApi,
  getUserApi,
  updateUserApi
} from '..//utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deleteCookie, setCookie } from '../utils/cookie';

export const getRegisterUserApi = createAsyncThunk(
  'user/getRegisterUser',
  async (data: TRegisterData) => {
    try {
      return await registerUserApi(data);
    } catch (err) {
      return Promise.reject(err);
    }
  }
);

export const getLoginUserApi = createAsyncThunk(
  'user/getLoginUser',
  async (data: TLoginData) => {
    try {
      return await loginUserApi(data);
    } catch (err) {
      return Promise.reject(err);
    }
  }
);

export const getLogoutApi = createAsyncThunk('user/getLogout', async () => {
  try {
    return await logoutApi();
  } catch (err) {
    return Promise.reject(err);
  }
});

export const checkGetUserApi = createAsyncThunk(
  'user/dataGetUserApi',
  async () => {
    try {
      return await getUserApi();
    } catch (err) {
      return Promise.reject(err);
    }
  }
);

export const getUpdateUserApi = createAsyncThunk(
  'user/updateUser',
  async (user: Partial<TRegisterData>) => {
    try {
      return await updateUserApi(user);
    } catch (err) {
      return Promise.reject(err);
    }
  }
);

export type TUserState = {
  email: string;
  name: string;
  isLoading: boolean;
  error: string;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
};

const initialState: TUserState = {
  email: '',
  name: '',
  isLoading: false,
  error: '',
  isAuthChecked: false,
  isAuthenticated: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addEmail: (state, action) => {
      state.email = action.payload;
    },
    addName: (state, action) => {
      state.name = action.payload;
    },
    setisAuthChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getRegisterUserApi.pending, (state) => {
      state.isLoading = true;
      state.error = '';
      state.isAuthenticated = false;
    });
    builder.addCase(getRegisterUserApi.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message
        ? action.error.message
        : 'Sorry, something went wrong';
      state.isAuthenticated = false;
    });
    builder.addCase(getRegisterUserApi.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = '';
      state.email = action.payload.user.email;
      state.name = action.payload.user.name;
      localStorage.setItem('refreshToken', action.payload.refreshToken);
      setCookie('accessToken', action.payload.accessToken);
      state.isAuthenticated = true;
    });
    builder.addCase(getLoginUserApi.pending, (state) => {
      state.isLoading = true;
      state.error = '';
      state.isAuthenticated = false;
    });
    builder.addCase(getLoginUserApi.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message
        ? action.error.message
        : 'Sorry, something went wrong';
      state.isAuthenticated = false;
    });
    builder.addCase(getLoginUserApi.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = '';
      state.isAuthenticated = true;
      localStorage.setItem('refreshToken', action.payload.refreshToken);
      setCookie('accessToken', action.payload.accessToken);
      state.name = action.payload.user.name;
      state.email = action.payload.user.email;
    });
    builder.addCase(getLogoutApi.pending, (state) => {
      state.isLoading = true;
      state.error = '';
    });
    builder.addCase(getLogoutApi.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message
        ? action.error.message
        : 'Sorry, something went wrong';
    });
    builder.addCase(getLogoutApi.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.name = '';
      state.email = '';
      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');
    });
    builder.addCase(checkGetUserApi.pending, (state) => {
      state.error = '';
      state.isLoading = true;
    }),
      builder.addCase(checkGetUserApi.rejected, (state, action) => {
        state.error = action.error.message
          ? action.error.message
          : 'Sorry, something went wrong';
        state.isAuthChecked = true;
        state.isLoading = false;
      });
    builder.addCase(checkGetUserApi.fulfilled, (state, action) => {
      state.error = '';
      state.isLoading = false;
      state.isAuthenticated = true;
      state.isAuthChecked = true;
      state.email = action.payload.user.email;
      state.name = action.payload.user.name;
    });
    builder.addCase(getUpdateUserApi.pending, (state) => {
      state.isLoading = true;
      state.error = '';
    });
    builder.addCase(getUpdateUserApi.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message
        ? action.error.message
        : 'Sorry, something went wrong';
      state.isAuthChecked = true;
    });
    builder.addCase(getUpdateUserApi.fulfilled, (state, action) => {
      state.isLoading = false;
      state.email = action.payload.user.email;
      state.name = action.payload.user.name;
      state.error = '';
      state.isAuthenticated = true;
      state.isAuthChecked = true;
    });
  },
  selectors: {
    getData: (state) => ({
      email: state.email,
      name: state.name
    }),
    getIsAuthenticated: (state) => state.isAuthenticated,
    getIsAuthChecked: (state) => state.isAuthChecked
  }
});

export const { addEmail, addName } = userSlice.actions;
export const { getData, getIsAuthenticated, getIsAuthChecked } =
  userSlice.selectors;
