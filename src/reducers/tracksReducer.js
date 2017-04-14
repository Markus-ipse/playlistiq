// @flow
import type { Paging, PlaylistTrack, Track } from "../types/spotify";
import type { Action } from "../actions/index";
import { combineReducers } from "redux";

export type PagesState = {
  [string]: {
    [number]: {
      offset: number,
      ids: string[],
      pending: boolean
    },
    total?: number,
    next: ?string,
    lastOffset: ?number,
    offsets: number[]
  }
};

export type TracksState = {
  entities: { [string]: Track },
  pages: PagesState
};

function entities(state = {}, action: Action) {
  switch (action.type) {
    case "FETCH_TRACKS_RES": {
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

const emptyArr = [];
const updateOffsets = (playlistPaging, offset) => {
  if (!playlistPaging) return emptyArr;
  if (!playlistPaging.offsets) return emptyArr;
  if (playlistPaging.offsets.includes(offset)) return playlistPaging.offsets;

  return [...playlistPaging.offsets, offset];
};

function pages(state = {}, action: Action) {
  switch (action.type) {
    case "FETCH_TRACKS_REQ": {
      const currentPl = state[action.playlist.id];

      return {
        ...state,
        [action.playlist.id]: {
          ...currentPl,
          offsets: currentPl ? currentPl.offsets : [],
          [action.offset]: {
            offset: action.offset,
            ids: [],
            pending: true
          }
        }
      };
    }

    case "FETCH_TRACKS_RES": {
      const { total, items, offset, next } = action.pagedTracks;
      const trackIds = items.map(item => item.track.id);

      const playlistPaging = state[action.playlistId];

      return {
        ...state,
        [action.playlistId]: {
          ...playlistPaging,
          total,
          next,
          lastOffset: offset,
          offsets: updateOffsets(playlistPaging, offset),
          [offset]: {
            offset: offset,
            ids: trackIds,
            pending: false
          }
        }
      };
    }

    default:
      return state;
  }
}

export const tracksReducer = combineReducers({
  entities,
  pages
});
