// @flow
import type {
  Paging,
  PlaylistTrack,
  SimplePlaylist,
  User
} from "../types/spotify";

export type FetchTracksReqAction = {
  type: "FETCH_TRACKS_REQ",
  playlist: SimplePlaylist,
  offset: number
};
export type FetchTracksResAction = {
  type: "FETCH_TRACKS_RES",
  pagedTracks: Paging<PlaylistTrack>,
  playlistId: string
};

export type Action =
  | { type: "FETCH_USER_REQ" }
  | { type: "FETCH_USER_RES", user: User }
  | { type: "REQUEST_UNAUTHORIZED" }
  | { type: "FETCH_PLAYLISTS_REQ" }
  | { type: "FETCH_PLAYLISTS_RES", pagedPlaylists: Paging<SimplePlaylist> }
  | FetchTracksReqAction
  | FetchTracksResAction;

export const fetchUser = (): Action => ({
  type: "FETCH_USER_REQ"
});
export const receiveUser = (user: User): Action => ({
  type: "FETCH_USER_RES",
  user
});

export const fetchPlaylists = (): Action => ({
  type: "FETCH_PLAYLISTS_REQ"
});
export const receivePlaylists = (
  pagedPlaylists: Paging<SimplePlaylist>
): Action => ({
  type: "FETCH_PLAYLISTS_RES",
  pagedPlaylists
});

export const fetchTracks = (
  playlist: SimplePlaylist,
  offset: ?number
): Action => ({
  type: "FETCH_TRACKS_REQ",
  playlist,
  offset
});

export const unauthorized = (): Action => ({ type: "REQUEST_UNAUTHORIZED" });
