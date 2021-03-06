import { TrackWithMeta } from '../reducers/selectors';
import { msToFriendly } from './msToFriendly';

export const isDev = () => process.env.NODE_ENV === 'development';

export const getTotalPlayTime = (tracks: TrackWithMeta[]) =>
  msToFriendly(tracks.reduce((sum, item) => sum + item.track.duration_ms, 0));

export const flatten = <T>(arr: T[][]): T[] =>
  arr.reduce((acc, subArr) => acc.concat(subArr));
