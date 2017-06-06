import { isDev } from './util/helpers';

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
  while (e = regexp.exec(q)) { // eslint-disable-line no-cond-assign
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}
/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export function login() {
  const client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID; // Your client id
  const redirect_uri = isDev() ? window.location.origin : process.env.REACT_APP_REDIRECT_URI; // Your redirect uri
  const state = generateRandomString(16);
  localStorage.setItem(stateKey, state);
  const scope = 'user-read-private user-read-email playlist-read-private';
  let url = 'https://accounts.spotify.com/authorize';
  url += '?response_type=token';
  url += '&client_id=' + encodeURIComponent(client_id);
  url += '&scope=' + encodeURIComponent(scope);
  url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
  url += '&state=' + encodeURIComponent(state);
  window.location = url;
}

export function isLoggedIn() {
  return !!localStorage.getItem(tokenKey);
}

const params = getHashParams();
const access_token = params.access_token;
const state = params.state;
const storedState = localStorage.getItem(stateKey);

document.location = '#'; // Clear hash params

if (access_token && (state == null || state !== storedState)) {
  alert('There was an error during the authentication');
} else {
  localStorage.removeItem(stateKey);
  if (access_token) {
    localStorage.setItem(tokenKey, access_token);
  }
}

export function spotifyReq(url, options = {}) {
  const access_token = localStorage.getItem(tokenKey);
  return window.fetch(url, {
    ...options,
    headers: {
      'Authorization': 'Bearer ' + access_token,
      ...options.headers
    }
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
