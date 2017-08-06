import { MapOf } from '../types/index';

export const toMap = <T, R>(
  IdKey: string,
  fn: (item: T) => R,
  arr: T[],
): MapOf<R> =>
  arr.reduce((acc, item) => {
    const itemId = item[IdKey];
    return { ...acc, [itemId]: fn(item) };
  }, {});
