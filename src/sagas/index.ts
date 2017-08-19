import { spawn } from 'redux-saga/effects';
import { playlistsSaga } from './playlistSaga';
import { tracksSaga } from './trackSaga';
import { userSaga } from './userSaga';

export function* rootSaga() {
  yield spawn(userSaga);
  yield spawn(playlistsSaga);
  yield spawn(tracksSaga);
}
