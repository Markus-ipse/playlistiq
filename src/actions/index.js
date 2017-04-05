// @flow
import type { User } from "../types/spotify";

export type Action =
  | { type: 'FETCH_USER_REQ' }
  | { type: 'FETCH_USER_RES', user: User }
  | { type: 'REQUEST_UNAUTHORIZED' };

export const fetchUser = () => ({ type: 'FETCH_USER_REQ' });
export const receiveUser = (user: User) => ({ type: 'FETCH_USER_RES', user });
export const unauthorized = (): Action => ({ type: 'REQUEST_UNAUTHORIZED' });

export type Dispatch = (action: Action) => Action;
