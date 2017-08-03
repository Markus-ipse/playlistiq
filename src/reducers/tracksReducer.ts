import { combineReducers } from 'redux';
import { Action } from '../actions/index';
import { Paging, PlaylistTrack, Track, User } from '../types/spotify';
import { shuffle } from '../util/shuffle';

export interface TrackMeta {
  id: number,
  trackId: string,
  addedAt: string,
  addedBy: User,
}

export interface PagesState {
  [key: string]: {
    tracks: TrackMeta[],
    total?: number,
    next?: string,
    lastOffset?: number,
    newOrder?: TrackMeta[],
  },
}

interface EntitiesState { [key: string]: Track }

export interface TracksState {
  entities: EntitiesState,
  pages: PagesState,
}

function entities(state: EntitiesState = {}, action: Action) {
  switch (action.type) {
    case 'FETCH_TRACKS_RES': {
      const pagedTracks: Paging<PlaylistTrack> = action.pagedTracks;
      const newTracks = pagedTracks.items.reduce((idMap, item) => {
        return { ...idMap, [item.track.id]: item.track };
      }, {});

      return { ...state, ...newTracks };
    }

    default:
      return state;
  }
}

let idx = 0;

const updateTracks = (tracks: TrackMeta[], items: PlaylistTrack[]) => {
  return (tracks || []).concat(
    items.map(item => ({
      trackId: item.track.id,
      id: idx++,
      addedAt: item.added_at,
      addedBy: item.added_by,
    }))
  );
};

function pages(state: PagesState = {}, action: Action) {
  switch (action.type) {
    case 'FETCH_TRACKS_REQ': {
      const currentPl = state[action.playlist.id];

      return {
        ...state,
        [action.playlist.id]: {
          ...currentPl,
        },
      };
    }

    case 'FETCH_TRACKS_RES': {
      const { total, items, offset, next } = action.pagedTracks;

      const playlistPaging = state[action.playlistId];

      return {
        ...state,
        [action.playlistId]: {
          ...playlistPaging,
          total,
          next,
          lastOffset: offset,
          tracks: updateTracks(playlistPaging.tracks, items),
        },
      };
    }

    case 'SCRAMBLE_TRACKS': {
      const currentPlayList = state[action.playlist.id];
      const newOrder = shuffle(currentPlayList.tracks);
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
