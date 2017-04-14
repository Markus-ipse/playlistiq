// @flow
import type {AppState} from "./index";

const playlistPages = (state, playlistId) => state.tracks.pages[playlistId];

export const playlistTracks = (state: AppState, playlistId) => {
  const tracks = playlistPages(state, playlistId).offsets
    .map(offset => playlistPages(state, playlistId)[offset].ids.map(
      trackId => state.tracks.entities[trackId]
    ));

  return Array.prototype.concat(...tracks);
};
