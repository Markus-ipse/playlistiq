import {
  ApiError,
  Paging,
  PlaylistTrack,
  SimplePlaylist,
  User,
} from '../types/spotify';
import { spotifyDELETE, spotifyPOST, spotifyReq } from './spotifyAuth';

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
    `/v1/users/${userId}/playlists/${playlistId}/tracks?offset=${offset}&limit=100`,
  );
}

// Technically returns a full Playlist object, but the difference is not important for the time being
export function createPlaylist(
  userId: string,
  name: string,
): Promise<SimplePlaylist> {
  return spotifyPOST(`/v1/users/${userId}/playlists`, { name });
}

export function addTracksToPlaylist(
  userId: string,
  playlistId: string,
  trackURIs: string[],
): Promise<{ snapshot_id: string }> {
  return spotifyPOST(`/v1/users/${userId}/playlists/${playlistId}/tracks`, {
    uris: trackURIs,
  });
}

export function unfollowPlaylist(
  ownerId: string,
  playlistId: string,
): Promise<null | ApiError> {
  return spotifyDELETE(
    `/v1/users/${ownerId}/playlists/${playlistId}/followers`,
  );
}
