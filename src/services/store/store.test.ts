import { store } from './index';

describe('rootReducer', () => {
  it('Должен вернуть начальное состояние для unknown action', () => {
    const initialState = store.getState();
    store.dispatch({ type: 'UNKNOWN_ACTION' });
    const newState = store.getState();

    expect(newState).toEqual(initialState);
  });
});
