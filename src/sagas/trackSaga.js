import { call, put, takeLatest, select } from 'redux-saga/effects';
import * as Spotify from '../spotifyAPI';
import type { FetchTracksReqAction } from '../actions/index';
import type { AppState } from '../reducers/index';

function* fetchPlaylistTracks({ playlist, offset }: FetchTracksReqAction) {
  const res = yield call(
    Spotify.getPlaylistTracks,
    playlist.owner.id,
    playlist.id,
    offset,
  );

  if (res.error) {
    const { error } = res;
    if (error.status === 401) {
      yield put({ type: 'REQUEST_UNAUTHORIZED', message: error.message });
    } else {
      console.error('Failed to fetch tracks:', error);
    }
  } else {
    yield put({
      type: 'FETCH_TRACKS_RES',
      pagedTracks: res,
      playlistId: playlist.id,
    });
  }
}

const SPOTIFY_PAGING_SIZE = 100;

function* fetchTracks({ playlist }: FetchTracksReqAction) {
  yield fetchPlaylistTracks({ playlist, offset: 0 });

  const playlistTracks = yield select(
    (state: AppState) => state.tracks.pages[playlist.id],
  );

  if (playlistTracks && playlistTracks.next) {
    let nextOffset = playlistTracks.lastOffset || 0;
    while ((nextOffset += SPOTIFY_PAGING_SIZE) < playlistTracks.total) {
      yield fetchPlaylistTracks({
        playlist,
        offset: nextOffset,
      });
    }
  }
}

export function* tracksSaga() {
  yield takeLatest('FETCH_TRACKS_REQ', fetchTracks);
}
