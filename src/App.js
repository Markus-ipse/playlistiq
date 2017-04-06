// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { login } from './auth';
import * as Spotify from './spotifyAPI';
import { Playlists } from './Playlists';
import { Tracks } from './Tracks';
import { AppState } from './reducers/index';
import { fetchPlaylists, fetchUser } from './actions/index';

import type { Paging, PlaylistTrack, SimplePlaylist, User } from './types/spotify';
import type { Dispatch } from './types/index';

import logo from './logo.svg';
import './App.css';


type Props = {
  isLoggedIn: boolean;
  user: ?User;
  userPending: boolean;
  playlists: ?Paging<SimplePlaylist>;
  playlistsPending: boolean;
  dispatch: Dispatch;
}

class App extends Component<any, Props, any> {
  state: {
    currentPlaylist: ?SimplePlaylist,
    tracks: ?Paging<PlaylistTrack>
  };

  props: Props;

  constructor(props: Props) {
    super(props);

    this.state = {
      currentPlaylist: null,
      tracks: null
    };
  }

  componentDidMount() {
    if (this.props.isLoggedIn) {
      this.props.dispatch(fetchUser());
      this.props.dispatch(fetchPlaylists());
    }
  }

  handleResponse = (key: string) => {
    return (res: any) => {
      if (res.error) {
        this.setState({
          currentPlaylist: null,
          tracks: null
        })
      } else {
        this.setState({ [key]: res })
      }
    };
  };

  getPlaylistTracks = (playlist: SimplePlaylist) => {
    const userId = this.props.user && this.props.user.id;
    if (!userId) return;

    this.setState({ currentPlaylist: playlist });

    Spotify.getPlaylistTracks(userId, playlist.id)
      .then(this.handleResponse('tracks'));
  };

  handleBackClick = () => {
    this.setState({ currentPlaylist: null })
  };

  render() {
    const { currentPlaylist, tracks } = this.state;
    const { user, isLoggedIn, playlists} = this.props;

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome {user && user.display_name}</h2>
        </div>
        <div className="container">
          {!isLoggedIn && <button onClick={login}>Login</button>}
          {!currentPlaylist &&
          <Playlists
            playlists={playlists}
            current={currentPlaylist}
            getTracks={this.getPlaylistTracks}
          />
          }
          {currentPlaylist &&
          <Tracks tracks={tracks} playlistTitle={currentPlaylist.name} handleBackClick={this.handleBackClick} />
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState, props) => ({
  isLoggedIn: state.user.isLoggedIn,
  user: state.user.data,
  userPending: state.user.isPending,
  playlists: state.playlists.data,
  playlistsPending: state.playlists.isPending
});

export default connect(mapStateToProps)(App);
