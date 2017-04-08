// @flow
import { combineReducers } from 'redux';

import userReducer from './userReducer';
import playlistReducer from './playlistReducer';
import tracksReducer from './tracksReducer';

import type { UserState } from './userReducer';
import type { PlaylistState } from './playlistReducer';
import type { TracksState } from './tracksReducer';

export type AppState = {
  user: UserState;
  playlists: PlaylistState;
  tracks: TracksState;
}

const appState = combineReducers({
  user: userReducer,
  playlists: playlistReducer,
  tracks: tracksReducer
});

export default appState;
