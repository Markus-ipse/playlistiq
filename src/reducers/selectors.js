// @flow
import type { AppState } from "./index";

const playlistPages = (state, playlistId) => state.tracks.pages[playlistId];

export const playlistTracksIds = (state: AppState, playlistId: string) => {
  const playlist = playlistPages(state, playlistId);
  const tracks = playlist.offsets.map(offset => playlist[offset].ids);

  return Array.prototype.concat(...tracks);
};

export const playlistTracks = (state: AppState, playlistId: string) => {
  const playlist = playlistPages(state, playlistId);
  const trackIds = playlist.newOrder ? playlist.newOrder : playlistTracksIds(state, playlistId);

  return trackIds.map(
    trackId => state.tracks.entities[trackId]
  );
};
