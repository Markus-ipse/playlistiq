// @flow

import { spotifyReq } from './auth';
import type { Paging, PlaylistTrack, SimplePlaylist, User } from './types/spotify';

export function getUser(): Promise<User> {
  return spotifyReq('https://api.spotify.com/v1/me');
}

export function getUserPlaylists(): Promise<Paging<SimplePlaylist>> {
  return spotifyReq('https://api.spotify.com/v1/me/playlists')
}

export function getPlaylistTracks(user_id: string, playlist_id: string): Promise<Paging<PlaylistTrack>> {
  return spotifyReq(`https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}/tracks`)
}
