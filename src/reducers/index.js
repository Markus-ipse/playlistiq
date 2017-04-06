import { combineReducers } from 'redux';

import userReducer from './userReducer';
import playlistReducer from './playlistReducer';

import type { UserState } from './userReducer';
import type { PlaylistState } from './playlistReducer';

export type AppState = {
  user: UserState;
  playlists: PlaylistState;
}

const appState = combineReducers({
  user: userReducer,
  playlists: playlistReducer
});

export default appState;
