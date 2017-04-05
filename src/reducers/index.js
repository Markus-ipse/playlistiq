import { combineReducers } from 'redux';

import userReducer, { UserState } from './userReducer';

export type AppState = {
  user: UserState;
}

const appState = combineReducers({
  user: userReducer
});

export default appState;
