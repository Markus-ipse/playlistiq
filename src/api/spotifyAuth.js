// @flow
import { isDev } from '../util/helpers';

const stateKey = 'spotify_auth_state';
const tokenKey = 'spotify_token';
/**
 * Obtains parameters from the hash of the URL
 * @return Object
 */
function getHashParams() {
  const hashParams = {};
  const regexp = /([^&;=]+)=?([^&;]*)/g;
  const q = window.location.hash.substring(1);

  let e;
  do {
    e = regexp.exec(q);
    if (e) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
  } while (e);
  return hashParams;
}
/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
function generateRandomString(length) {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export function login(showDialog: boolean) {
  const client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID; // Your client id
  const redirect_uri = isDev()
    ? window.location.origin
    : process.env.REACT_APP_REDIRECT_URI; // Your redirect uri

  if (!client_id) {
    throw new Error('Missing client_id');
  }
  if (!redirect_uri) {
    throw new Error('Missing redirect_uri');
  }

  const state = generateRandomString(16);
  window.localStorage.setItem(stateKey, state);
  const scope =
    'user-read-private user-read-email playlist-read-private playlist-modify-public';
  let url = 'https://accounts.spotify.com/authorize';
  url += '?response_type=token';
  url += '&client_id=' + encodeURIComponent(client_id);
  url += '&scope=' + encodeURIComponent(scope);
  url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
  url += '&state=' + encodeURIComponent(state);

  if (showDialog) {
    url += '&show_dialog=true';
  }

  window.location = url;
}

export function isLoggedIn() {
  return !!localStorage.getItem(tokenKey);
}

const params = getHashParams();
const access_token = params.access_token;
const state = params.state;
const storedState = localStorage.getItem(stateKey);

document.location.hash = ''; // Clear hash params

if (access_token && (state == null || state !== storedState)) {
  alert('There was an error during the authentication');
} else {
  localStorage.removeItem(stateKey);
  if (access_token) {
    localStorage.setItem(tokenKey, access_token);
  }
}

const host = 'https://api.spotify.com';
export function spotifyReq(url: string, options: any = {}) {
  const access_token = localStorage.getItem(tokenKey) || '';
  const fullUrl = url.includes(host) ? url : host + url;

  return window
    .fetch(fullUrl, {
      ...options,
      headers: {
        Authorization: 'Bearer ' + access_token,
        ...options.headers,
      },
    })
    .then(res => res.json())
    .then(res => {
      if (res.error && res.error.status === 401) {
        console.info(res.error);
        localStorage.removeItem(tokenKey);
      }
      return res;
    });
}

export function spotifyPOST(url: string, data: any) {
  return spotifyReq(url, {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export function spotifyDELETE(url: string) {
  return spotifyReq(url, {
    method: 'DELETE',
  });
}
