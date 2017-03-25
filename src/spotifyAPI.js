import { spotifyReq } from './auth';

export function getUser() {
  return spotifyReq('https://api.spotify.com/v1/me');
}

export function getUserPlaylists() {
  return spotifyReq('https://api.spotify.com/v1/me/playlists')
}

export function getPlaylistTracks(user_id, playlist_id) {
  return spotifyReq(`https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}/tracks`)
}
