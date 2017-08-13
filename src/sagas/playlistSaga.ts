import { call, Effect, put, select, takeLatest } from 'redux-saga/effects';
import {
  CreatePlaylistsAction,
  DeletePlaylistsAction,
  playlistCreated,
  playlistDeleteError,
  receivePlaylists,
  unauthorized
} from '../actions/index';
import * as Spotify from '../api/spotifyAPI';
import * as Select from '../reducers/selectors';
import { chunkArray } from '../util/chunkArray';

import { isApiError } from '../api/helpers';
import { AddTracksRes, ApiError, SimplePlaylist, User } from '../types/spotify';

function* fetchUserPlaylists(): IterableIterator<Effect> {
  const res = yield call(Spotify.getUserPlaylists);
  if (res.error) {
    const { error } = res;
    if (error.status === 401) {
      yield put(unauthorized(error.message));
    } else {
      console.error('Failed to fetch playlists:', error);
    }
  } else {
    yield put(receivePlaylists(res));
  }
}

function* addTracks(userId: string, playlistId: string, trackURIs: string[]) {
  // const chunked = chunkArray(trackURIs, 101, true); // Todo use for testing failure recovery
  const chunked = chunkArray(trackURIs, 100, true);
  for (const URIs of chunked) {
    const res: AddTracksRes = yield call(
      Spotify.addTracksToPlaylist,
      userId,
      playlistId,
      URIs,
    );

    if (isApiError(res)) {
      console.log('Doh!', res);
    } else {
      console.log('Woho!', res);
    }
  }

  // Todo: handle errors
}

function* createPlaylists(
  action: CreatePlaylistsAction,
): IterableIterator<Effect | Effect[]> {
  const { groupedTracks, playlist } = action;
  const user: User = yield select(Select.user);

  for (const [i, newPL] of Array.from(groupedTracks.entries()).reverse()) {
    const playlistName = `🔀 ${playlist.name} pt. ${i + 1}`;
    console.log('creating', playlistName);
    const createdPlaylist: SimplePlaylist = yield call(
      Spotify.createPlaylist,
      user.id,
      playlistName,
    );
    yield put(playlistCreated(createdPlaylist));
    const trackURIs = newPL.map(t => t.track.uri);
    yield call(addTracks, user.id, createdPlaylist.id, trackURIs);
  }
}

function* deletePlaylists(
  action: DeletePlaylistsAction,
): IterableIterator<Effect> {
  for (const pl of action.playlists) {
    const response: ApiError | null = yield call(Spotify.unfollowPlaylist, pl.owner.id, pl.id);
    if (response && response.error) {
      console.info(response.error);
      yield put(playlistDeleteError(pl, response));
    }
  }
}

export function* playlistsSaga() {
  yield takeLatest('FETCH_PLAYLISTS_REQ', fetchUserPlaylists);
  yield takeLatest('CREATE_PLAYLISTS', createPlaylists);
  yield takeLatest('DELETE_PLAYLISTS', deletePlaylists);
}
