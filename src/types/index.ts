import { Dispatch as ReduxDispatch } from 'redux';
import { Action } from '../actions/index';
import { SimplePlaylist } from './spotify';

export type Dispatch = ReduxDispatch<Action>;

export interface CreatedPlaylist extends SimplePlaylist { createdByApp: true; }

export type Playlist = SimplePlaylist | CreatedPlaylist;

export interface MapOf<T> {
    [K: string]: T;
}
