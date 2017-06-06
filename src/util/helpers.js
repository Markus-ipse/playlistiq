// @flow
import type { TrackWithMeta } from '../reducers/selectors';

export const isDev = () => process.env.NODE_ENV === 'development';

export const chunkArray = (arr: any[], chunks: number) => {
  if (chunks < 1) {
    throw new Error(
      `Invalid chunk count (${chunks}). Must be at least 1 chunk`,
    );
  }
  if (chunks > arr.length) {
    throw new Error(
      `Invalid chunk count (${chunks}). Cannot have more chunks than items in the array (${arr.length})`,
    );
  }

  const chunkSize = arr.length / chunks;
  const groups = [];
  let i;

  for (i = 0; i < arr.length; i += chunkSize) {
    groups.push(arr.slice(i, i + chunkSize));
  }

  return groups;
};

export const msToFriendly = (millisec: number) => {
  let seconds = Math.round(millisec / 1000);
  let minutes = Math.round(seconds / 60);
  let hours = 0;
  if (minutes > 59) {
    hours = Math.floor(minutes / 60);
    minutes = minutes - (hours * 60);
  }

  if (hours > 0) {
    return hours + " hr " + minutes + " min";
  }
  return minutes + " min";
};

export const getTotalPlayTime = (tracks: TrackWithMeta[]) =>
  msToFriendly(tracks.reduce((sum, item) => sum + item.track.duration_ms, 0));
