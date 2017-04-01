// @flow
import React, { Component } from 'react';
import { isLoggedIn, login } from './auth';
import * as Spotify from './spotifyAPI';
import { Playlists } from './Playlists';
import { Tracks } from './Tracks';

import type { Paging, PlaylistTrack, SimplePlaylist, User } from './types/spotify';

import logo from './logo.svg';
import './App.css';

class App extends Component {
  state: {
    loggedIn: boolean,
    playlists: ?Paging<SimplePlaylist>,
    currentPlaylist: ?SimplePlaylist,
    user: ?User,
    tracks: ?Paging<PlaylistTrack>
  };

  constructor(props: any) {
    super(props);

    this.state = {
      loggedIn: isLoggedIn(),
      user: null,
      playlists: null,
      currentPlaylist: null,
      tracks: null
    };
  }

  componentDidMount() {
    if (this.state.loggedIn) {
      Spotify.getUser()
        .then(this.handleResponse('user'));

      Spotify.getUserPlaylists()
        .then(this.handleResponse('playlists'));
    }
  }

  handleResponse = (key: string) => {
    return (res: any) => {
      if (res.error) {
        this.setState({
          loggedIn: false,
          user: null,
          playlists: null,
          currentPlaylist: null,
          tracks: null
        })
      } else {
        this.setState({ [key]: res })
      }
    };
  };

  getPlaylistTracks = (playlist: SimplePlaylist) => {
    const userId = this.state.user && this.state.user.id;
    if (!userId) return;

    this.setState({ currentPlaylist: playlist });

    Spotify.getPlaylistTracks(userId, playlist.id)
      .then(this.handleResponse('tracks'));
  };

  handleBackClick = () => {
    this.setState({ currentPlaylist: null })
  };

  render() {
    const { user, loggedIn, currentPlaylist, playlists, tracks } = this.state;

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome {user && user.display_name}</h2>
        </div>
        <div className="container">
          {!loggedIn && <button onClick={login}>Login</button>}
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

export default App;
