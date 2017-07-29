// @flow
import type { Store as ReduxStore, Dispatch as ReduxDispatch } from 'redux';
import type { Action } from '../actions/index';
import type { AppState } from '../reducers/index';
import type { SimplePlaylist } from './spotify';

export type Store = ReduxStore<AppState, Action>;

export type Dispatch = ReduxDispatch<Action>;

export type CreatedPlaylist = SimplePlaylist & { createdByApp: true };

export type Playlist = SimplePlaylist | CreatedPlaylist;
