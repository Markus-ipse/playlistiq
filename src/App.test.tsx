import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './App';

const noop = () => {}; // tslint:disable-line

const props = {
  user: {
    data: null,
    isPending: false,
    isLoggedIn: false,
  },
  playlists: [],
  playlistsPending: false,
  fetchUser: noop,
  fetchPlaylists: noop,
  deletePlaylists: noop,
  fetchTracks: noop,
};

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App {...props} />, div);
});
