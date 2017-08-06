import { CreatedPlaylist, Playlist } from '../types/index';
import { SimplePlaylist, Track, User } from '../types/spotify';
import { AppState } from './index';
import { DeletePlaylistsState } from './playlistReducer';

export interface TrackWithMeta {
  id: number;
  track: Track;
  addedAt: string;
  addedBy: User;
}

const emptyArr: TrackWithMeta[] = [];

const playlistTrackPages = (state: AppState, playlistId: string) =>
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
  state.playlists.createdPlaylists;

const deletedPlaylists = (state: AppState): DeletePlaylistsState =>
  state.playlists.deletedPlaylists;

export const playlists = (state: AppState): Playlist[] =>
    [...createdPlaylists(state), ...fetchedPlaylists(state)]
    .filter(pl => {
      const deletedPlaylist = deletedPlaylists(state)[pl.id];
      return !deletedPlaylist || deletedPlaylist.error;
    });

export const tracksPending = (state: AppState, playlistId: string) =>
  playlistTrackPages(state, playlistId).next !== null;

export const user = (state: AppState) =>
  state.user.data ? state.user.data : null;

export const playlistsPending = (state: AppState) =>
  state.playlists.fetchedPlaylists.isPending;
