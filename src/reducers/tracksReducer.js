// @flow
import { combineReducers } from 'redux';
import type { Paging, PlaylistTrack, Track, User } from '../types/spotify';
import type { Action } from '../actions/index';
import { shuffle } from '../util/shuffle';

export type TrackMeta = {
  id: number,
  trackId: string,
  addedAt: string,
  addedBy: User,
};

export type PagesState = {
  [string]: {
    tracks: TrackMeta[],
    total: ?number,
    next: ?string,
    lastOffset: ?number,
    newOrder: ?TrackMeta[],
  },
};

export type TracksState = {
  entities: { [string]: Track },
  pages: PagesState,
};

function entities(state = {}, action: Action) {
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

const updateTracks = (tracks, items: PlaylistTrack[]) => {
  return (tracks || []).concat(
    items.map(item => ({
      trackId: item.track.id,
      id: idx++,
      addedAt: item.added_at,
      addedBy: item.added_by,
    })),
  );
};

function pages(state: PagesState = {}, action: Action) {
  switch (action.type) {
    case 'FETCH_TRACKS_REQ': {
      const currentPl = state[action.playlist.id];
      if (action.offset == null) return state;

      return {
        ...state,
        [action.playlist.id]: {
          ...currentPl,
          pending: true,
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
          pending: false,
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
