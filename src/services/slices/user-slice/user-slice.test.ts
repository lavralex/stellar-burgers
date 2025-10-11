import userReducer, {
  loginUser,
  logoutUser,
  getUser,
  updateUser,
  registerUser,
  checkUserAuth,
  setAuthChecked,
  initialState
} from './index';

jest.mock('@api', () => ({
  loginUserApi: jest.fn(),
  logoutApi: jest.fn(),
  getUserApi: jest.fn(),
  updateUserApi: jest.fn(),
  registerUserApi: jest.fn()
}));

jest.mock('../../../utils/cookie', () => ({
  setCookie: jest.fn(),
  getCookie: jest.fn(),
  deleteCookie: jest.fn()
}));

describe('Слайс пользователя', () => {

  const mockUser = {
    email: 'test@example.com',
    name: 'Тестовый пользователь'
  };

  it('должен возвращать начальное состояние', () => {
    expect(userReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('должен устанавливать isLoading в true при loginUser.pending', () => {
    const action = loginUser.pending('requestId', {
      email: 'test@example.com',
      password: 'password'
    });
    const state = userReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен устанавливать data и isLoading в false при loginUser.fulfilled', () => {
    const state = userReducer(
      initialState,
      loginUser.fulfilled(mockUser, 'requestId', {
        email: 'test@example.com',
        password: 'password'
      })
    );
    expect(state.isLoading).toBe(false);
    expect(state.data).toEqual(mockUser);
    expect(state.error).toBeNull();
    expect(state.isAuthChecked).toBe(true);
  });

  it('должен устанавливать error и isLoading в false при loginUser.rejected', () => {
    const errorMessage = 'Ошибка авторизации';
    const error = new Error(errorMessage);

    const state = userReducer(
      initialState,
      loginUser.rejected(error, 'requestId', {
        email: 'test@example.com',
        password: 'password'
      })
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.isAuthChecked).toBe(true);
  });

  it('должен очищать data при logoutUser.fulfilled', () => {
    const stateWithUser = {
      data: mockUser,
      isAuthChecked: true,
      isLoading: false,
      error: null
    };

    const state = userReducer(
      stateWithUser,
      logoutUser.fulfilled(undefined, 'requestId')
    );
    expect(state.data).toBeNull();
  });

  it('должен устанавливать data при getUser.fulfilled', () => {
    const mockApiResponse = {
      success: true,
      user: mockUser
    };

    const state = userReducer(
      initialState,
      getUser.fulfilled(mockApiResponse, 'requestId')
    );
    expect(state.data).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
  });

  it('должен устанавливать isAuthChecked в true при getUser.rejected', () => {
    const error = new Error('Ошибка получения пользователя');

    const state = userReducer(
      initialState,
      getUser.rejected(error, 'requestId')
    );
    expect(state.isAuthChecked).toBe(true);
  });

  it('должен обновлять data при updateUser.fulfilled', () => {
    const initialUser = { email: 'old@example.com', name: 'Старое имя' };
    const updatedUser = { email: 'new@example.com', name: 'Новое имя' };

    const stateWithUser = {
      data: initialUser,
      isAuthChecked: true,
      isLoading: false,
      error: null
    };

    const state = userReducer(
      stateWithUser,
      updateUser.fulfilled(updatedUser, 'requestId', {
        name: 'Новое имя',
        email: 'new@example.com'
      })
    );

    expect(state.data).toEqual(updatedUser);
  });

  it('должен устанавливать data при registerUser.fulfilled', () => {
    const state = userReducer(
      initialState,
      registerUser.fulfilled(mockUser, 'requestId', {
        email: 'test@example.com',
        password: 'password',
        name: 'Тестовый пользователь'
      })
    );
    expect(state.data).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
  });

  it('должен устанавливать isAuthChecked в true при checkUserAuth.fulfilled', () => {
    const state = userReducer(
      initialState,
      checkUserAuth.fulfilled(undefined, 'requestId')
    );
    expect(state.isAuthChecked).toBe(true);
  });

  it('должен устанавливать isAuthChecked в true при setAuthChecked', () => {
    const state = userReducer(initialState, setAuthChecked());
    expect(state.isAuthChecked).toBe(true);
  });
});
