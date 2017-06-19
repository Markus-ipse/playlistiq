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

const playlistPages = (state, playlistId) => state.tracks.pages[playlistId];

export const playlistTrackIds = (state: AppState, playlistId: string) => {
  const playlist = playlistPages(state, playlistId);

  const tracks = playlist.tracks;
  return tracks || emptyArr;
};

export const playlistTracks = (
  state: AppState,
  playlistId: string,
): TrackWithMeta[] => {
  const playlist = playlistPages(state, playlistId);
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

export const user = (state: AppState) => state.user.data ? state.user.data : null;
