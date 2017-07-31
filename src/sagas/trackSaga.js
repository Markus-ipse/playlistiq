// @flow
import { call, put, takeLatest, select } from 'redux-saga/effects';
import * as Spotify from '../api/spotifyAPI';
import { unauthorized } from '../actions/index';

import type { AppState } from '../reducers/index';
import type { FetchTracksAction } from '../actions/index';
import type { Playlist } from '../types/index';

function* fetchPlaylistTracks({
  playlist,
  offset,
}: { offset: number, playlist: Playlist }) {
  const res = yield call(
    Spotify.getPlaylistTracks,
    playlist.owner.id,
    playlist.id,
    offset,
  );

  if (res.error) {
    const { error } = res;
    if (error.status === 401) {
      yield put(unauthorized(error.message));
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

function* fetchTracks({ playlist }: FetchTracksAction) {
  yield fetchPlaylistTracks({ playlist, offset: 0 });

  const playlistTracks = yield select(
    (state: AppState) => state.tracks.pages[playlist.id],
  );

  if (playlistTracks && playlistTracks.next) {
    let nextOffset = playlistTracks.lastOffset || 0;
    do {
      nextOffset += SPOTIFY_PAGING_SIZE;
      yield fetchPlaylistTracks({
        playlist,
        offset: nextOffset,
      });
    } while (nextOffset < playlistTracks.total);
  }
}

export function* tracksSaga(): Generator<*, *, *> {
  yield takeLatest('FETCH_TRACKS_REQ', fetchTracks);
}
