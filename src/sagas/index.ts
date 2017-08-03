import { fork } from 'redux-saga/effects';
import { playlistsSaga } from './playlistSaga';
import { tracksSaga } from './trackSaga';
import { userSaga } from './userSaga';

export function* rootSaga() {
  yield fork(userSaga);
  yield fork(playlistsSaga);
  yield fork(tracksSaga);
}
