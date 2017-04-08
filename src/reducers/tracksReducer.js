// @flow
import type { Paging, PlaylistTrack, } from '../types/spotify';
import type { Action } from '../actions/index';

export type TracksState = {
  data: ?Paging<PlaylistTrack>;
  isPending: boolean;
}

const initialState: TracksState = { data: null, isPending: false };

export default function tracksReducer(state: TracksState = initialState, action: Action): TracksState {
  switch (action.type) {
    case 'FETCH_TRACKS_REQ':
      return { ...state, isPending: true };

    case 'FETCH_TRACKS_RES':
      return { data: action.pagedTracks, isPending: false };

    case 'REQUEST_UNAUTHORIZED':
      return { data: null, isPending: false };

    default:
      return state;
  }
}
