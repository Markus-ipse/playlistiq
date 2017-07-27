// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { login } from './auth';
import { Playlists } from './Playlists';
import PlaylistView from './PlaylistView';
import { fetchPlaylists, fetchUser, fetchTracks } from './actions/index';

import type { Dispatch } from './types/index';
import type { AppState } from './reducers/index';
import type { SimplePlaylist, User } from './types/spotify';

import logo from './logo.svg';
import './App.css';
import * as Selectors from './reducers/selectors';

type Props = {
  isLoggedIn: boolean,
  user: ?User,
  userPending: boolean,
  playlists: SimplePlaylist[],
  playlistsPending: boolean,
  dispatch: Dispatch,
};

type State = {
  currentPlaylist: ?SimplePlaylist,
};

class App extends Component<any, Props, State> {
  confirmDialog;

  state;

  constructor(props: Props) {
    super(props);

    this.state = {
      currentPlaylist: null,
    };
  }

  componentDidMount() {
    if (this.props.isLoggedIn) {
      this.props.dispatch(fetchUser());
      this.props.dispatch(fetchPlaylists());
    }
  }

  getPlaylistTracks = (playlist: SimplePlaylist) => {
    this.setState({ currentPlaylist: playlist });

    this.props.dispatch(fetchTracks(playlist));
  };

  handleBackClick = () => {
    this.setState({ currentPlaylist: null });
  };

  handleLogin = () => {
    login(this.confirmDialog.checked);
  };

  render() {
    const { currentPlaylist } = this.state;
    const { user, isLoggedIn, playlists } = this.props;

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>
            Welcome {user && user.display_name}
          </h2>
        </div>
        <div className="container">
          {!isLoggedIn &&
            <div className="ps-m">
              <button className="button is-primary" onClick={this.handleLogin}>
                Login
              </button>
              <p className="control ps-m-t">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    ref={input => (this.confirmDialog = input)}
                  />
                  {' '} Show Spotify confirm dialog
                </label>
              </p>
            </div>}
          {!currentPlaylist &&
            isLoggedIn &&
            <Playlists
              playlists={playlists}
              current={currentPlaylist}
              getTracks={this.getPlaylistTracks}
            />}
          {currentPlaylist &&
            isLoggedIn &&
            <PlaylistView
              playlist={currentPlaylist}
              handleBackClick={this.handleBackClick}
            />}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState, props: Props) => ({
  isLoggedIn: state.user.isLoggedIn,
  user: state.user.data,
  userPending: state.user.isPending,
  playlists: Selectors.playlists(state),
  playlistsPending: Selectors.playlistsPending(state),
});

export default connect(mapStateToProps)(App);
