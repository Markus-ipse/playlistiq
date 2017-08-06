import { Action } from '../actions/index';
import { ApiError, Paging, SimplePlaylist } from '../types/spotify';

import { combineReducers } from 'redux';
import { CreatedPlaylist, MapOf } from '../types/index';
import { toMap } from '../util/arrayToMap';

export interface FetchedPlaylistsState {
  data: Paging<SimplePlaylist> | null;
  isPending: boolean;
}

interface DeletedPlaylist {
  playlistId: string;
  success: boolean;
  error: ApiError | null;
}

export type DeletePlaylistsState = MapOf<DeletedPlaylist>;

export interface PlaylistState {
  fetchedPlaylists: FetchedPlaylistsState;
  createdPlaylists: CreatedPlaylist[];
  deletedPlaylists: DeletePlaylistsState;
}

function createdPlaylistsReducer(
  state: CreatedPlaylist[] = [],
  action: Action,
) {
  return action.type === 'PLAYLIST_CREATED'
    ? state.concat({ ...action.playlist, createdByApp: true })
    : state;
}

function deletedPlaylistsReducer(
  state: DeletePlaylistsState = {},
  action: Action,
): DeletePlaylistsState {
  switch (action.type) {
    case 'DELETE_PLAYLISTS':
      const { playlists } = action;
      const asMap = toMap(
        'id',
        pl => ({ success: false, error: null, playlistId: pl.id }),
        playlists,
      );
      return { ...state, ...asMap };

    case 'PLAYLIST_DELETE_ERROR':
      const deletedPl = state[action.playlist.id];
      return {
        ...state,
        [action.playlist.id]: { ...deletedPl, error: action.error },
      };
    default:
      return state;
  }
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
  deletedPlaylists: deletedPlaylistsReducer,
});
