// @flow
import type { Paging, SimplePlaylist } from '../types/spotify';
import type { Action } from '../actions/index';

import { combineReducers } from 'redux';
import type { CreatedPlaylist } from '../types/index';

export type FetchedPlaylistsState = {
  data: ?Paging<SimplePlaylist>,
  isPending: boolean,
};

export type PlaylistState = {
  fetchedPlaylists: FetchedPlaylistsState,
  createdPlaylist: CreatedPlaylist[],
};

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
  state = initialState,
  action: Action,
): FetchedPlaylistsState {
  switch (action.type) {
    case 'FETCH_PLAYLISTS_REQ':
      return { ...state, isPending: true };

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
  createdPlaylist: createdPlaylistsReducer,
});
