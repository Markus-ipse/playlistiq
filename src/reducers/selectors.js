// @flow
import type { AppState } from './index';
import type { SimplePlaylist, Track, User } from '../types/spotify';
import type { CreatedPlaylist, Playlist } from '../types/index';

export type TrackWithMeta = {
  id: number,
  track: Track,
  addedAt: string,
  addedBy: User,
};

const emptyArr = [];

const playlistTrackPages = (state, playlistId) =>
  state.tracks.pages[playlistId];

export const playlistTrackIds = (state: AppState, playlistId: string) => {
  const playlist = playlistTrackPages(state, playlistId);

  const tracks = playlist.tracks;
  return tracks || emptyArr;
};

export const isScrambled = (state: AppState, playlistId: string) =>
  !!playlistTrackPages(state, playlistId).newOrder;

export const playlistTracks = (
  state: AppState,
  playlistId: string,
): TrackWithMeta[] => {
  const playlist = playlistTrackPages(state, playlistId);
  const trackMetas = playlist.newOrder
    ? playlist.newOrder
    : playlistTrackIds(state, playlistId);

  return trackMetas.map(item => {
    const { trackId, ...rest } = item;
    return {
      ...rest,
      track: state.tracks.entities[trackId],
    };
  });
};

const fetchedPlaylists = (state: AppState): SimplePlaylist[] =>
  state.playlists.fetchedPlaylists.data
    ? state.playlists.fetchedPlaylists.data.items
    : [];

const createdPlaylists = (state: AppState): CreatedPlaylist[] =>
  state.playlists.createdPlaylist;

export const playlists = (state: AppState): Playlist[] =>
  createdPlaylists(state).concat(fetchedPlaylists(state));

export const tracksPending = (state: AppState, playlistId: string) =>
  playlistTrackPages(state, playlistId).next !== null;

export const user = (state: AppState) =>
  state.user.data ? state.user.data : null;

export const playlistsPending = (state: AppState) =>
  state.playlists.fetchedPlaylists.isPending;
