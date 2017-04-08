// @flow
import type { Paging, SimplePlaylist } from '../types/spotify';
import type { Action } from '../actions/index';

export type PlaylistState = {
  data: ?Paging<SimplePlaylist>;
  isPending: boolean;
}

const initialState: PlaylistState = { data: null, isPending: false };

export default function playlistReducer(state: PlaylistState = initialState, action: Action): PlaylistState {
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
