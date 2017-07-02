// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { login } from './auth';
import { Playlists } from './Playlists';
import Tracks from './PlaylistView';
import { fetchPlaylists, fetchUser, fetchTracks } from './actions/index';

import type { Dispatch } from './types/index';
import type { AppState } from './reducers/index';
import type { Paging, SimplePlaylist, User } from './types/spotify';

import logo from './logo.svg';
import './App.css';

type Props = {
  isLoggedIn: boolean,
  user: ?User,
  userPending: boolean,
  playlists: ?Paging<SimplePlaylist>,
  playlistsPending: boolean,
  dispatch: Dispatch,
};

class App extends Component {
  state: {
    currentPlaylist: ?SimplePlaylist,
  };

  props: Props;

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

  render() {
    const { currentPlaylist } = this.state;
    const { user, isLoggedIn, playlists } = this.props;

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome {user && user.display_name}</h2>
        </div>
        <div className="container">
          {!isLoggedIn &&
            <button className="button is-primary" onClick={login}>
              Login
            </button>}
          {!currentPlaylist &&
            <Playlists
              playlists={playlists}
              current={currentPlaylist}
              getTracks={this.getPlaylistTracks}
            />}
          {currentPlaylist &&
            <Tracks
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
  playlists: state.playlists.data,
  playlistsPending: state.playlists.isPending,
});

export default connect(mapStateToProps)(App);
