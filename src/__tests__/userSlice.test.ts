import { expect, test, describe, jest } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import {
  userSlice,
  getRegisterUserApi,
  getLoginUserApi,
  getLogoutApi,
  checkGetUserApi,
  getUpdateUserApi
} from '../services/userSlice';
import * as cookieUtils from '../utils/cookie';
import 'jest-localstorage-mock';

describe('userSlice/getRegisterUserApi', () => {
  const registerRespond = {
    success: true,
    user: {
      email: 'someemail94@yandex.ru',
      name: 'someName'
    },
    accessToken: 'someAccessToken',
    refreshToken: 'someRefreshToken'
  };

  const registerData = {
    email: 'someEmail',
    name: 'someName',
    password: 'somePassword'
  };

  const store = configureStore({
    reducer: {
      user: userSlice.reducer
    }
  });
  test('should set isLoading to true on pending', async () => {
    const pendingPromise = new Promise(() => {});
    jest
      .spyOn(require('../utils/burger-api'), 'registerUserApi')
      .mockImplementation(() => pendingPromise);

    store.dispatch(getRegisterUserApi(registerData));

    expect(store.getState().user.isLoading).toBe(true);
    expect(store.getState().user.isAuthenticated).toBe(false);
  });

  test('should set isLoading to false and isAuthenticated to true on fulfilled', async () => {
    jest
      .spyOn(require('../utils/burger-api'), 'registerUserApi')
      .mockResolvedValue(registerRespond);

    await store.dispatch(getRegisterUserApi(registerData));

    expect(store.getState().user.isLoading).toBe(false);
    expect(store.getState().user.isAuthenticated).toBe(true);
    expect(localStorage.getItem('refreshToken')).toBe(
      registerRespond.refreshToken //jest-environment-jsdom
    );
    expect(cookieUtils.getCookie('accessToken')).toBe(
      registerRespond.accessToken //jsdom
    );
  });

  test('should set isLoading to false and error on rejected', async () => {
    const errorMassage = 'Failed';
    jest
      .spyOn(require('../utils/burger-api'), 'registerUserApi')
      .mockImplementation(() => Promise.reject(new Error(errorMassage)));

    await store.dispatch(getRegisterUserApi(registerData));

    expect(store.getState().user.isLoading).toBe(false);
    expect(store.getState().user.error).toBe(errorMassage);
    expect(store.getState().user.isAuthenticated).toBe(false);
  });
});

describe('userSlice/loginUserApi', () => {
  const loginRespond = {
    success: true,
    accessToken: 'someAccessTokenForLogin',
    refreshToken: 'someRefreshTokenForLogin',
    user: {
      email: 'someEmail94@yandex.ru',
      name: 'someName'
    }
  };

  const loginData = {
    email: 'someEmail',
    password: 'somePassword'
  };

  const store = configureStore({
    reducer: {
      user: userSlice.reducer
    }
  });
  test('should set isLoading to true on pending', async () => {
    const pendingPromise = new Promise(() => {});
    jest
      .spyOn(require('../utils/burger-api'), 'loginUserApi')
      .mockImplementation(() => pendingPromise);

    store.dispatch(getLoginUserApi(loginData));

    expect(store.getState().user.isLoading).toBe(true);
    expect(store.getState().user.isAuthenticated).toBe(false);
  });

  test('should set isLoading to false and isAuthenticated to true on fulfilled', async () => {
    jest
      .spyOn(require('../utils/burger-api'), 'loginUserApi')
      .mockResolvedValue(loginRespond);

    await store.dispatch(getLoginUserApi(loginData));

    expect(store.getState().user.isLoading).toBe(false);
    expect(store.getState().user.isAuthenticated).toBe(true);
    expect(localStorage.getItem('refreshToken')).toBe(
      loginRespond.refreshToken
    );
    expect(cookieUtils.getCookie('accessToken')).toBe(loginRespond.accessToken);
  });

  test('should set isLoading to false and error on rejected', async () => {
    const errorMassage = 'Failed';
    jest
      .spyOn(require('../utils/burger-api'), 'loginUserApi')
      .mockImplementation(() => Promise.reject(new Error(errorMassage)));

    await store.dispatch(getLoginUserApi(loginData));

    expect(store.getState().user.isLoading).toBe(false);
    expect(store.getState().user.error).toBe(errorMassage);
    expect(store.getState().user.isAuthenticated).toBe(false);
  });
});

describe('userSlice/logoutApi', () => {
  const logoutRespond = {
    success: true,
    message: 'Successful logout'
  };

  const store = configureStore({
    reducer: {
      user: userSlice.reducer
    }
  });

  test('should set isLoading to true on pending', async () => {
    const pendingPromise = new Promise(() => {});
    jest
      .spyOn(require('../utils/burger-api'), 'logoutApi')
      .mockImplementation(() => pendingPromise);

    store.dispatch(getLogoutApi());

    expect(store.getState().user.isLoading).toBe(true);
  });

  test('should set isLoading to false and isAuthenticated to false on fulfilled', async () => {
    jest
      .spyOn(require('../utils/burger-api'), 'logoutApi')
      .mockResolvedValue(logoutRespond);

    await store.dispatch(getLogoutApi());

    expect(store.getState().user.isLoading).toBe(false);
    expect(store.getState().user.isAuthenticated).toBe(false);
    expect(localStorage.getItem('refreshToken')).toBe(null);
    expect(cookieUtils.getCookie('accessToken')).toBe(undefined);
  });

  test('should set isLoading to false and error on rejected', async () => {
    const errorMassage = 'Failed';
    jest
      .spyOn(require('../utils/burger-api'), 'logoutApi')
      .mockImplementation(() => Promise.reject(new Error(errorMassage)));

    await store.dispatch(getLogoutApi());

    expect(store.getState().user.isLoading).toBe(false);
    expect(store.getState().user.error).toBe(errorMassage);
  });
});

describe('userSlice/getUserApi', () => {
  const getUserRespond = {
    success: true,
    user: {
      email: 'someEmail94@yandex.ru',
      name: 'someName'
    }
  };

  const store = configureStore({
    reducer: {
      user: userSlice.reducer
    }
  });

  test('should set isLoading to true on pending', async () => {
    const pendingPromise = new Promise(() => {});
    jest
      .spyOn(require('../utils/burger-api'), 'getUserApi')
      .mockImplementation(() => pendingPromise);

    store.dispatch(checkGetUserApi());

    expect(store.getState().user.isLoading).toBe(true);
  });

  test('should set isLoading to false and isAuthenticated to true on fulfilled', async () => {
    jest
      .spyOn(require('../utils/burger-api'), 'getUserApi')
      .mockResolvedValue(getUserRespond);

    await store.dispatch(checkGetUserApi());

    expect(store.getState().user.isLoading).toBe(false);
    expect(store.getState().user.isAuthenticated).toBe(true);
    expect(store.getState().user.email).toBe(getUserRespond.user.email);
    expect(store.getState().user.name).toBe(getUserRespond.user.name);
  });

  test('should set isLoading to false and error on rejected', async () => {
    const errorMassage = 'Failed';
    jest
      .spyOn(require('../utils/burger-api'), 'getUserApi')
      .mockImplementation(() => Promise.reject(new Error(errorMassage)));

    await store.dispatch(checkGetUserApi());

    expect(store.getState().user.isLoading).toBe(false);
    expect(store.getState().user.error).toBe(errorMassage);
  });
});

describe('userSlice/updateUserApi', () => {
  const updateUserRespond = {
    success: true,
    user: {
      email: 'someEmail94@yandex.ru',
      name: 'SomeName'
    }
  };

  const updateData = {
    password: '1234'
  };

  const store = configureStore({
    reducer: {
      user: userSlice.reducer
    }
  });

  test('should set isLoading to true on pending', async () => {
    const pendingPromise = new Promise(() => {});
    jest
      .spyOn(require('../utils/burger-api'), 'updateUserApi')
      .mockImplementation(() => pendingPromise);

    store.dispatch(getUpdateUserApi(updateData));

    expect(store.getState().user.isLoading).toBe(true);
  });

  test('should set isLoading to false and isAuthenticated to true on fulfilled', async () => {
    jest
      .spyOn(require('../utils/burger-api'), 'updateUserApi')
      .mockResolvedValue(updateUserRespond);

    await store.dispatch(getUpdateUserApi(updateData));

    expect(store.getState().user.isLoading).toBe(false);
    expect(store.getState().user.email).toBe(updateUserRespond.user.email);
    expect(store.getState().user.isAuthChecked).toBe(true);
  });

  test('should set isLoading to false and error on rejected', async () => {
    const errorMassage = 'Failed';
    jest
      .spyOn(require('../utils/burger-api'), 'updateUserApi')
      .mockImplementation(() => Promise.reject(new Error(errorMassage)));

    await store.dispatch(getUpdateUserApi(updateData));

    expect(store.getState().user.isLoading).toBe(false);
    expect(store.getState().user.error).toBe(errorMassage);
    expect(store.getState().user.isAuthChecked).toBe(true);
  });
});
