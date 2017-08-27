import { combineReducers } from 'redux';
import { Action } from '../actions/index';
import { Track, User } from '../types/spotify';
import { toMap } from '../util/arrayToMap';
import { shuffle } from '../util/shuffle';

export interface TrackMeta {
  id: number;
  trackId: string;
  addedAt: string;
  addedBy: User;
}

export interface PagesState {
  [key: string]: {
    isPending: boolean;
    tracks: TrackMeta[];
    newOrder?: TrackMeta[];
  };
}

interface EntitiesState {
  [key: string]: Track;
}

export interface TracksState {
  entities: EntitiesState;
  pages: PagesState;
}

function entities(state: EntitiesState = {}, action: Action) {
  switch (action.type) {
    case 'ALL_TRACKS_RECEIVED': {
      const tracksById = toMap(
        'track.id',
        item => item.track,
        action.playlistTracks,
      );

      return { ...state, ...tracksById };
    }

    default:
      return state;
  }
}

let idx = 0;

function pages(state: PagesState = {}, action: Action) {
  switch (action.type) {
    case 'FETCH_TRACKS_REQ': {
      if (state[action.playlist.id]) return state;

      return {
        ...state,
        [action.playlist.id]: {
          isPending: true,
        },
      };
    }

    case 'ALL_TRACKS_RECEIVED': {
      return {
        ...state,
        [action.playlistId]: {
          isPending: false,
          tracks: action.playlistTracks.map(item => ({
              trackId: item.track.id,
              id: idx++, // Fixme: impure
              addedAt: item.added_at,
              addedBy: item.added_by,
            }),
          ),
        },
      };
    }

    case 'SCRAMBLE_TRACKS': {
      const currentPlayList = state[action.playlist.id];
      const newOrder = shuffle(currentPlayList.tracks); // Fixme: impure :(
      const newPlayList = {
        ...currentPlayList,
        newOrder,
      };

      return { ...state, [action.playlist.id]: newPlayList };
    }

    default:
      return state;
  }
}

export const tracksReducer = combineReducers({
  entities,
  pages,
});
