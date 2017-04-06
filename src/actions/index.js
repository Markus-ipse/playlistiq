// @flow
import type { Paging, SimplePlaylist, User } from "../types/spotify";

export type Action =
  | { type: 'FETCH_USER_REQ' }
  | { type: 'FETCH_USER_RES', user: User }
  | { type: 'REQUEST_UNAUTHORIZED' }
  | { type: 'FETCH_PLAYLISTS_REQ' }
  | { type: 'FETCH_PLAYLISTS_RES', pagedPlaylists: Paging<SimplePlaylist> }

export const fetchUser = (): Action => ({ type: 'FETCH_USER_REQ' });
export const receiveUser = (user: User): Action => ({ type: 'FETCH_USER_RES', user });

export const fetchPlaylists = (): Action => ({ type: 'FETCH_PLAYLISTS_REQ' });
export const receivePlaylists = (pagedPlaylists: Paging<SimplePlaylist>): Action => ({ type: 'FETCH_PLAYLISTS_RES', pagedPlaylists });

export const unauthorized = (): Action => ({ type: 'REQUEST_UNAUTHORIZED' });

