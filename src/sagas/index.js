import { fork } from 'redux-saga/effects';
import { userSaga } from './userSaga';

export function* rootSaga() {
  yield fork(userSaga);
}
