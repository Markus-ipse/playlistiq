import { call, put, takeLatest } from 'redux-saga/effects';
import * as Spotify from '../spotifyAPI';

function* fetchUserPlaylists(action) {
  const res = yield call(Spotify.getUserPlaylists);
  if (res.error) {
    const { error } = res;
    if (error.status === 401) {
      yield put({ type: 'REQUEST_UNAUTHORIZED', message: error.message });
    } else {
      console.error('Failed to fetch playlists:', error);
    }
  } else {
    yield put({ type: 'FETCH_PLAYLISTS_RES', pagedPlaylists: res });
  }
}

export function* playlistsSaga() {
  yield takeLatest('FETCH_PLAYLISTS_REQ', fetchUserPlaylists);
}
