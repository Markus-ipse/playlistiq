import { call, put, takeLatest, select } from "redux-saga/effects";
import * as Spotify from "../spotifyAPI";
import type { FetchTracksReqAction } from "../actions/index";

function* fetchPlaylistTracks({ playlist }: FetchTracksReqAction) {
  const res = yield call(
    Spotify.getPlaylistTracks,
    playlist.owner.id,
    playlist.id
  );

  if (res.error) {
    const { error } = res;
    if (error.status === 401) {
      yield put({ type: "REQUEST_UNAUTHORIZED", message: error.message });
    } else {
      console.error("Failed to fetch tracks:", error);
    }
  } else {
    yield put({ type: "FETCH_TRACKS_RES", pagedTracks: res });
  }
}

export function* tracksSaga() {
  yield takeLatest("FETCH_TRACKS_REQ", fetchPlaylistTracks);
}
