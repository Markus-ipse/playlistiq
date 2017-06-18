// @flow

import { spotifyReq } from './auth';
import type {
  Paging,
  PlaylistTrack,
  SimplePlaylist,
  User,
} from './types/spotify';

export function getUser(): Promise<User> {
  return spotifyReq('https://api.spotify.com/v1/me');
}

export function getUserPlaylists(): Promise<Paging<SimplePlaylist>> {
  return spotifyReq('https://api.spotify.com/v1/me/playlists');
}

export function getPlaylistTracks(
  userId: string,
  playlistId: string,
  offset: number = 0,
): Promise<Paging<PlaylistTrack>> {
  return spotifyReq(
    `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks?offset=${offset}&limit=100`,
  );
}

export function createPlaylist(userId: string) {
  return spotifyReq(`https://api.spotify.com/v1/users/${userId}/playlists`);
}
