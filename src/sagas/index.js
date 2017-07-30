// @flow
import { fork } from 'redux-saga/effects';
import { userSaga } from './userSaga';
import { playlistsSaga } from './playlistSaga';
import { tracksSaga } from './trackSaga';

export function* rootSaga(): Generator<*, * ,*> {
  yield fork(userSaga);
  yield fork(playlistsSaga);
  yield fork(tracksSaga);
}
