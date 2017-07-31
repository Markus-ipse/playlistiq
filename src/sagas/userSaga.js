// @flow
import { call, put, takeLatest } from 'redux-saga/effects';
import * as Spotify from '../api/spotifyAPI';
import { receiveUser, unauthorized } from '../actions/index';

function* fetchUserSaga(): Generator<*, *, *> {
  const res = yield call(Spotify.getUser);
  if (res.error) {
    const { error } = res;
    if (error.status === 401) {
      yield put(unauthorized(error.message));
    } else {
      console.error('Failed to fetch user:', error);
    }
  } else {
    yield put(receiveUser(res));
  }
}

export function* userSaga(): Generator<*, *, *> {
  yield takeLatest('FETCH_USER_REQ', fetchUserSaga);
}
