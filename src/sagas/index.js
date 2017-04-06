import { fork } from 'redux-saga/effects';
import { userSaga } from './userSaga';
import { playlistsSaga } from './playlistSaga';

export function* rootSaga() {
  yield fork(userSaga);
  yield fork(playlistsSaga);
}
