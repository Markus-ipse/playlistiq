// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { login } from './api/spotifyAuth';
import MyPlaylistsView from './views/MyPlaylistsView';
import PlaylistView from './views/PlaylistView';
import {
  fetchPlaylists,
  fetchUser,
  fetchTracks,
  deletePlaylists,
} from './actions/index';
import * as Selectors from './reducers/selectors';

import type { Dispatch, Playlist } from './types/index';
import type { AppState } from './reducers/index';
import type { UserState } from './reducers/userReducer';

import './App.css';

type Props = {
  user: UserState,
  playlists: Playlist[],
  playlistsPending: boolean,
  dispatch: Dispatch,
};

type State = {
  currentPlaylist: ?Playlist,
};

export class App extends Component<any, Props, State> {
  confirmDialog: HTMLInputElement;

  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      currentPlaylist: null,
    };
  }

  componentDidMount() {
    if (this.props.user.isLoggedIn) {
      this.props.dispatch(fetchUser());
      this.props.dispatch(fetchPlaylists());
    }
  }

  getPlaylistTracks = (playlist: Playlist) => {
    this.setState({ currentPlaylist: playlist });

    this.props.dispatch(fetchTracks(playlist));
  };

  handleBackClick = () => {
    this.setState({ currentPlaylist: null });
  };

  handleLogin = () => {
    login(this.confirmDialog.checked);
  };

  handleDeletePlaylists = (playlists: Playlist[]) => {
    this.props.dispatch(deletePlaylists(playlists));
  };

  render() {
    const { currentPlaylist } = this.state;
    const { playlists, user } = this.props;

    return (
      <div>
        <div className="container">
          {!user.isLoggedIn &&
            <div className="ps-m">
              <button className="button is-primary" onClick={this.handleLogin}>
                Login
              </button>
              <p className="control ps-m-t">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    ref={input => (this.confirmDialog = input)}
                  />{' '}
                   Show Spotify confirm dialog
                </label>
              </p>
            </div>}
          {!currentPlaylist &&
            user.isLoggedIn &&
            <MyPlaylistsView
              user={user.data}
              playlists={playlists}
              getTracks={this.getPlaylistTracks}
              onDelete={this.handleDeletePlaylists}
            />}
          {currentPlaylist &&
            user.isLoggedIn &&
            <PlaylistView
              playlist={currentPlaylist}
              handleBackClick={this.handleBackClick}
            />}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  user: state.user,
  playlists: Selectors.playlists(state),
  playlistsPending: Selectors.playlistsPending(state),
});

export default connect(mapStateToProps)(App);
