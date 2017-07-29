// @flow
import type {
  Paging,
  PlaylistTrack,
  SimplePlaylist,
  User,
} from '../types/spotify';
import type { TrackWithMeta } from '../reducers/selectors';
import type { Playlist } from '../types/index';

export type FetchTracksAction = {
  type: 'FETCH_TRACKS_REQ',
  playlist: Playlist,
};
export type FetchTracksResAction = {
  type: 'FETCH_TRACKS_RES',
  pagedTracks: Paging<PlaylistTrack>,
  playlistId: string,
};

export type ScrambleTracksAction = {
  type: 'SCRAMBLE_TRACKS',
  playlist: Playlist,
};

export type CreatePlaylistsAction = {
  type: 'CREATE_PLAYLISTS',
  playlist: SimplePlaylist,
  groupedTracks: Array<TrackWithMeta[]>,
};

export type PlaylistCreatedAction = {
  type: 'PLAYLIST_CREATED',
  playlist: SimplePlaylist,
};

export type ReqUnauthorizedAction = {
  type: 'REQUEST_UNAUTHORIZED',
  message: string,
};

export type FetchUserAction = { type: 'FETCH_USER_REQ' };

export type ReceiveUserAction = { type: 'FETCH_USER_RES', user: User };

export type FetchPlaylistsAction = { type: 'FETCH_PLAYLISTS_REQ' };

export type ReceivePlaylistsAction = {
  type: 'FETCH_PLAYLISTS_RES',
  pagedPlaylists: Paging<SimplePlaylist>,
};

export type Action =
  | FetchUserAction
  | ReceiveUserAction
  | ReqUnauthorizedAction
  | FetchPlaylistsAction
  | ReceivePlaylistsAction
  | FetchTracksAction
  | FetchTracksResAction
  | CreatePlaylistsAction
  | PlaylistCreatedAction
  | ScrambleTracksAction;

export const fetchUser = (): FetchUserAction => {
  return {
    type: 'FETCH_USER_REQ',
  };
};
export const receiveUser = (user: User): ReceiveUserAction => ({
  type: 'FETCH_USER_RES',
  user,
});

export const fetchPlaylists = (): FetchPlaylistsAction => ({
  type: 'FETCH_PLAYLISTS_REQ',
});

export const fetchTracks = (playlist: Playlist): FetchTracksAction => ({
  type: 'FETCH_TRACKS_REQ',
  playlist,
});

export const scrambleTracks = (playlist: Playlist): ScrambleTracksAction => ({
  type: 'SCRAMBLE_TRACKS',
  playlist,
});

export const createPlaylists = (
  playlist: Playlist,
  groupedTracks: Array<TrackWithMeta[]>,
): CreatePlaylistsAction => ({
  type: 'CREATE_PLAYLISTS',
  playlist,
  groupedTracks,
});

export const playlistCreated = (
  playlist: SimplePlaylist,
): PlaylistCreatedAction => ({
  type: 'PLAYLIST_CREATED',
  playlist,
});

export const unauthorized = (message: string): ReqUnauthorizedAction => ({
  type: 'REQUEST_UNAUTHORIZED',
  message,
});

export const receivePlaylists = (
  pagedPlaylists: Paging<SimplePlaylist>,
): ReceivePlaylistsAction => ({
  type: 'FETCH_PLAYLISTS_RES',
  pagedPlaylists,
});
