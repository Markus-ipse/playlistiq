import { playlistReducer, PlaylistState } from './playlistReducer';
import { tracksReducer, TracksState } from './tracksReducer';
import { userReducer, UserState } from './userReducer';

export interface AppState {
  user: UserState;
  playlists: PlaylistState;
  tracks: TracksState;
}

export const appStateReducers = {
  user: userReducer,
  playlists: playlistReducer,
  tracks: tracksReducer,
};
