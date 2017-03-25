const stateKey = 'spotify_auth_state';
/**
 * Obtains parameters from the hash of the URL
 * @return Object
 */
function getHashParams() {
    const hashParams = {};
    const r = /([^&;=]+)=?([^&;]*)/g;
    const q = window.location.hash.substring(1);

    let e;
    while (e = r.exec(q)) {
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
    const client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
    const redirect_uri = process.env.REDIRECT_URI; // Your redirect uri
    const state = generateRandomString(16);
    localStorage.setItem(stateKey, state);
    const scope = 'user-read-private user-read-email';
    let url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(client_id);
    url += '&scope=' + encodeURIComponent(scope);
    url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
    url += '&state=' + encodeURIComponent(state);
    window.location = url;
}

var userProfileSource = document.getElementById('user-profile-template').innerHTML,
    // userProfileTemplate = Handlebars.compile(userProfileSource),
    userProfilePlaceholder = document.getElementById('user-profile');
var oauthSource = document.getElementById('oauth-template').innerHTML,
    // oauthTemplate = Handlebars.compile(oauthSource),
    oauthPlaceholder = document.getElementById('oauth');

const params = getHashParams();
var access_token = params.access_token,
    state = params.state,
    storedState = localStorage.getItem(stateKey);

if (access_token && (state == null || state !== storedState)) {
    alert('There was an error during the authentication');
} else {
    localStorage.removeItem(stateKey);
    if (access_token) {
        $.ajax({
            url: 'https://api.spotify.com/v1/me',
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function(response) {
                userProfilePlaceholder.innerHTML = userProfileTemplate(response);
                $('#login').hide();
                $('#loggedin').show();
            }
        });
    } else {
        $('#login').show();
        $('#loggedin').hide();
    }

}
