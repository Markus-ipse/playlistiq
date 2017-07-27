// @flow
import { call, put, takeLatest, select } from 'redux-saga/effects';
import * as Spotify from '../spotifyAPI';
import * as Select from '../reducers/selectors';

import type { IOEffect } from 'redux-saga/effects';
import type { CreatePlaylistsAction } from '../actions/index';
import type { AddTracksRes, SimplePlaylist, User } from '../types/spotify';
import { chunkArray } from '../util/helpers';
import { playlistCreated } from '../actions/index';

function* fetchUserPlaylists() {
  const res = yield call(Spotify.getUserPlaylists);
  if (res.error) {
    const { error } = res;
    if (error.status === 401) {
      yield put({ type: 'REQUEST_UNAUTHORIZED', message: error.message });
    } else {
      console.error('Failed to fetch playlists:', error);
    }
  } else {
    yield put({ type: 'FETCH_PLAYLISTS_RES', pagedPlaylists: res });
  }
}

function* addTracks(userId, playlistId, trackURIs) {
  const chunked = chunkArray(trackURIs, 101, true);
  for (let URIs of chunked) {
    const res: AddTracksRes = yield call(
      Spotify.addTracksToPlaylist,
      userId,
      playlistId,
      URIs,
    );
  }

  // Todo: handle errors
}

function* createPlaylists(action: CreatePlaylistsAction) {
  const { groupedTracks, playlist } = action;
  const user: User = yield select(Select.user);

  for (let [i, newPL] of groupedTracks.entries()) {
    const playlistName = `🔀 ${playlist.name} pt. ${i + 1}`;
    console.log('creating', playlistName);
    const createdPlaylist: SimplePlaylist = yield call(
      Spotify.createPlaylist,
      user.id,
      playlistName,
    );
    yield put(playlistCreated(createdPlaylist));
    const trackURIs = newPL.map(t => t.track.uri);
    yield call(
      addTracks,
      user.id,
      createdPlaylist.id,
      trackURIs,
    );
  }

}
export function* playlistsSaga(): Generator<IOEffect, *, *> {
  yield takeLatest('FETCH_PLAYLISTS_REQ', fetchUserPlaylists);
  yield takeLatest('CREATE_PLAYLISTS', createPlaylists);
}
