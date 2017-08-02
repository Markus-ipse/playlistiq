// @flow
import { call, put, takeLatest, select, type IOEffect } from 'redux-saga/effects';
import * as Spotify from '../api/spotifyAPI';
import * as Select from '../reducers/selectors';
import { chunkArray } from '../util/helpers';
import {
  playlistCreated, playlistDeleteError,
  receivePlaylists,
  unauthorized,
} from '../actions/index';

import type {
CreatePlaylistsAction,
DeletePlaylistsAction,
} from '../actions/index';
import type { AddTracksRes, SimplePlaylist, User } from '../types/spotify';

function* fetchUserPlaylists(): Generator<*, *, *> {
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

function* addTracks(userId, playlistId, trackURIs): Generator<*, *, *> {
  // const chunked = chunkArray(trackURIs, 101, true); // Todo use for testing failure recovery
  const chunked = chunkArray(trackURIs, 100, true);
  for (let URIs of chunked) {
    const res: AddTracksRes = yield call(
      Spotify.addTracksToPlaylist,
      userId,
      playlistId,
      URIs,
    );

    if (res.error) {
      console.log('Doh!', res);
    } else {
      console.log('Woho!', res);
    }
  }

  // Todo: handle errors
}

function* createPlaylists(action: CreatePlaylistsAction): Generator<*, *, *> {
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
    yield call(addTracks, user.id, createdPlaylist.id, trackURIs);
  }
}

function* deletePlaylists(action: DeletePlaylistsAction): Generator<IOEffect, *, *> {
  for (let pl of action.playlists) {
    const response = yield call(Spotify.unfollowPlaylist, pl.owner.id, pl.id);
    console.log('Deleted', pl.name, response);
    if (response.error) {
      console.log(response.error);
      yield put(playlistDeleteError(pl, response.error))
    }
  }
}

export function* playlistsSaga(): Generator<IOEffect, *, *> {
  yield takeLatest('FETCH_PLAYLISTS_REQ', fetchUserPlaylists);
  yield takeLatest('CREATE_PLAYLISTS', createPlaylists);
  yield takeLatest('DELETE_PLAYLISTS', deletePlaylists);
}
