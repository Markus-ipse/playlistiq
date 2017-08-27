import { MapOf } from '../types/index';
import { deepGet } from './deepGet';

export const toMap = <T, R>(
  idKey: string,
  fn: (item: T) => R,
  arr: T[],
): MapOf<R> =>
  arr.reduce((acc, item) => {
    const itemId = deepGet(idKey, item);
    if (itemId == null) throw new Error('itemId cannot be null or undefined')

    return { ...acc, [itemId]: fn(item) };
  }, {});
