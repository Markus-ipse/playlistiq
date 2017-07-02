// @flow
import type { AppState } from './index';
import type { Track, User } from '../types/spotify';

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

export const tracksPending = (state: AppState, playlistId: string) =>
  playlistTrackPages(state, playlistId).next !== null;

export const user = (state: AppState) =>
  state.user.data ? state.user.data : null;
