import { Action } from '../actions/index';
import { isLoggedIn } from '../api/spotifyAuth';
import { User } from '../types/spotify';

export interface UserState {
  data: User | null,
  isPending: boolean,
  isLoggedIn: boolean,
}

const initialState: UserState = {
  data: null,
  isPending: false,
  isLoggedIn: isLoggedIn(),
};

export function userReducer(
  state: UserState = initialState,
  action: Action
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
