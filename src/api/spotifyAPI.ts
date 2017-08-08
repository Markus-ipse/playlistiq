import {
  ApiError,
  Paging,
  PlaylistTrack,
  SimplePlaylist,
  User,
} from '../types/spotify';
import {
  spotifyDELETE,
  SpotifyGET,
  spotifyPOST,
  spotifyPUT,
} from './spotifyAuth';

export function getUser(): Promise<User> {
  return SpotifyGET('https://api.spotify.com/v1/me');
}

export function getUserPlaylists(): Promise<Paging<SimplePlaylist>> {
  return SpotifyGET('https://api.spotify.com/v1/me/playlists');
}

export function getPlaylistTracks(
  userId: string,
  playlistId: string,
  offset: number = 0,
): Promise<Paging<PlaylistTrack>> {
  return SpotifyGET(
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

export function playTracks(trackUris?: string[]) {
  const options = trackUris ? { uris: trackUris } : null;
  return spotifyPUT('/v1/me/player/play', options);
}

export function getCurrentPlayback() {
  return SpotifyGET('https://api.spotify.com/v1/me/player');
}
