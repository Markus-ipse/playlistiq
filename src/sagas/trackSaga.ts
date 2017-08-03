import { call, put, select, takeLatest } from 'redux-saga/effects';
import { unauthorized } from '../actions/index';
import * as Spotify from '../api/spotifyAPI';

import { Effect } from 'redux-saga';
import { FetchTracksAction } from '../actions/index';
import { AppState } from '../reducers/index';
import { Playlist } from '../types/index';

function* fetchPlaylistTracks({
  playlist,
  offset,
}: {
  offset: number;
  playlist: Playlist;
}): IterableIterator<Effect> {
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

function* fetchTracks({
  playlist,
}: FetchTracksAction): IterableIterator<Effect> {
  yield call(fetchPlaylistTracks, { playlist, offset: 0 });

  const playlistTracks = yield select(
    (state: AppState) => state.tracks.pages[playlist.id],
  );

  if (playlistTracks && playlistTracks.next) {
    let nextOffset = playlistTracks.lastOffset || 0;
    do {
      nextOffset += SPOTIFY_PAGING_SIZE;
      yield call(fetchPlaylistTracks, {
        playlist,
        offset: nextOffset,
      });
    } while (nextOffset < playlistTracks.total);
  }
}

export function* tracksSaga(): IterableIterator<Effect> {
  yield takeLatest('FETCH_TRACKS_REQ', fetchTracks);
}
