import { Effect } from 'redux-saga';
import {
  call,
  put,
  select,
  takeLatest,
} from 'redux-saga/effects';
import {
  FetchTracksAction,
  receiveTracks,
  unauthorized,
} from '../actions/index';
import * as Spotify from '../api/spotifyAPI';
import * as Select from '../reducers/selectors';

import { isApiError } from '../api/helpers';
import { Playlist } from '../types/index';
import { Paging, PlaylistTrack } from '../types/spotify';

function* fetchPlaylistTracks({
  playlist,
  offset,
}: {
  offset: number;
  playlist: Playlist;
}): IterableIterator<Effect> {
  const res: Paging<PlaylistTrack> = yield call(
    Spotify.getPlaylistTracks,
    playlist.owner.id,
    playlist.id,
    offset,
  );

  if (isApiError(res)) {
    const { error } = res;
    if (error.status === 401) {
      yield put(unauthorized(error.message));
    } else {
      console.error('Failed to fetch tracks:', error);
    }
  }

  return res;
}

const SPOTIFY_PAGING_SIZE = 100;

function* fetchTracks({
  playlist,
}: FetchTracksAction): IterableIterator<Effect> {
  const pl = yield select(Select.playlistTrackPages, playlist.id);

  if (pl && pl.tracks) return;

  const playlistTracks: PlaylistTrack[] = [];

  let playlistTrackPaging;
  let nextOffset = 0;
  do {
    playlistTrackPaging = yield call(fetchPlaylistTracks, {
      playlist,
      offset: nextOffset,
    });

    playlistTracks.push(...playlistTrackPaging.items);

    nextOffset += SPOTIFY_PAGING_SIZE;
  } while (!isApiError(playlistTrackPaging) && playlistTrackPaging.next);

  yield put(receiveTracks(playlist.id, playlistTracks));
}

export function* tracksSaga(): IterableIterator<Effect> {
  yield takeLatest('FETCH_TRACKS_REQ', fetchTracks);
}
