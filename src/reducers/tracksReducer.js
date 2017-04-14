// @flow
import type { Paging, PlaylistTrack, Track } from "../types/spotify";
import type { Action } from "../actions/index";
import { combineReducers } from "redux";

export type TracksState = {
  entities: { [string]: Track },
  pages: {
    [string]: {
      total?: number,
      next: ?string,
      lastOffset: ?number,
      [number]: {
        offset: number,
        ids: string[],
        pending: boolean
      }
    }
  }
};

function entities(state = {}, action: Action) {
  switch (action.type) {
    case "FETCH_TRACKS_RES": {
      const pagedTracks: Paging<PlaylistTrack> = action.pagedTracks;
      const newTracks = pagedTracks.items.reduce(
        (idMap, item) => {
          return { ...idMap, [item.track.id]: item.track };
        },
        {}
      );

      return { ...state, ...newTracks };
    }

    default:
      return state;
  }
}

function pages(state = {}, action: Action) {
  switch (action.type) {
    case "FETCH_TRACKS_REQ": {
      const currentPl = state[action.playlist.id];
      const currentOffset = currentPl && currentPl[action.offset];
      const currentIds = currentOffset && currentOffset.ids || [];
      return {
        ...state,
        [action.playlist.id]: {
          ...currentPl,
          [action.offset]: {
            offset: action.offset,
            ids: currentIds,
            pending: true
          }
        }
      };
    }

    case "FETCH_TRACKS_RES":
      const { total, items, offset, next } = action.pagedTracks;
      const trackIds = items.map(item => item.track.id);

      return {
        ...state,
        [action.playlistId]: {
          total,
          next,
          lastOffset: offset,
          [offset]: {
            offset: offset,
            ids: trackIds,
            pending: false
          }
        }
      };

    default:
      return state;
  }
}

export const tracksReducer = combineReducers({
  entities,
  pages
});
