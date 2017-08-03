import { Action } from '../actions/index';
import { Paging, SimplePlaylist } from '../types/spotify';

import { combineReducers } from 'redux';
import { CreatedPlaylist } from '../types/index';

export interface FetchedPlaylistsState {
  data: Paging<SimplePlaylist> | null;
  isPending: boolean;
}

export interface PlaylistState {
  fetchedPlaylists: FetchedPlaylistsState;
  createdPlaylists: CreatedPlaylist[];
}

function createdPlaylistsReducer(
  state: CreatedPlaylist[] = [],
  action: Action,
) {
  return action.type === 'PLAYLIST_CREATED'
    ? state.concat({ ...action.playlist, createdByApp: true })
    : state;
}

const initialState: FetchedPlaylistsState = { data: null, isPending: false };

function fetchedPlaylistsReducer(
  state: FetchedPlaylistsState = initialState,
  action: Action,
): FetchedPlaylistsState {
  switch (action.type) {
    case 'FETCH_PLAYLISTS_REQ':
      return { data: null, isPending: true };

    case 'FETCH_PLAYLISTS_RES':
      return { data: action.pagedPlaylists, isPending: false };

    case 'REQUEST_UNAUTHORIZED':
      return { data: null, isPending: false };

    default:
      return state;
  }
}

export const playlistReducer = combineReducers({
  fetchedPlaylists: fetchedPlaylistsReducer,
  createdPlaylists: createdPlaylistsReducer,
});
