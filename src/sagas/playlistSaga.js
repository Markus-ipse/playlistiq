import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import * as Spotify from "../spotifyAPI";

function* fetchUserPlaylists(action) {
  const res = yield call(Spotify.getUser);
  if (res.error) {
    const { error } = res;
    if (error.status === 401) {
      yield put({ type: "REQUEST_UNAUTHORIZED", message: error.message });
    } else {
      console.error("Failed to fetch user:", error);
    }
  } else {
    yield put({ type: "FETCH_USER_RES", user: res });
  }
}

export function* userSaga() {
  yield takeLatest("FETCH_USER_REQ", fetchUserPlaylists);
}
