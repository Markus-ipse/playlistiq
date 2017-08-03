import { call, Effect, put, takeLatest } from 'redux-saga/effects';
import { receiveUser, unauthorized } from '../actions';
import * as Spotify from '../api/spotifyAPI';

function* fetchUserSaga(): IterableIterator<Effect> {
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

export function* userSaga(): IterableIterator<Effect> {
  yield takeLatest('FETCH_USER_REQ', fetchUserSaga);
}
