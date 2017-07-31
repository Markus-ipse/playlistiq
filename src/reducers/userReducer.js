// @flow
import type { User } from '../types/spotify';
import type { Action } from '../actions/index';
import { isLoggedIn } from '../api/spotifyAuth';

export type UserState = {
  isLoggedIn: boolean,
  data: ?User,
  isPending: boolean,
};

const initialState: UserState = {
  data: null,
  isPending: false,
  isLoggedIn: isLoggedIn(),
};

export function userReducer(
  state: UserState = initialState,
  action: Action,
): UserState {
  switch (action.type) {
    case 'FETCH_USER_REQ':
      return { ...state, isPending: true };

    case 'FETCH_USER_RES':
      return { data: action.user, isPending: false, isLoggedIn: true };

    case 'REQUEST_UNAUTHORIZED':
      return { data: null, isPending: false, isLoggedIn: false };

    default:
      return state;
  }
}
