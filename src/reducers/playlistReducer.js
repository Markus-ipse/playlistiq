// @flow
import type { Paging, SimplePlaylist } from '../types/spotify';
import type { Action } from '../actions/index';

import { combineReducers } from 'redux';

export type FetchedPlaylistsState = {
  data: ?Paging<SimplePlaylist>,
  isPending: boolean,
}

export type PlaylistState = {
  fetchedPlaylists: FetchedPlaylistsState,
  createdPlaylist: SimplePlaylist[],
};


function createdPlaylistsReducer(state: SimplePlaylist[] = [], action: Action) {
  return action.type === 'PLAYLIST_CREATED'
    ? state.concat(action.playlist)
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

export default combineReducers({
  fetchedPlaylists: fetchedPlaylistsReducer,
  createdPlaylist: createdPlaylistsReducer,
});
