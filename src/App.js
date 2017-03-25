import React, { Component } from 'react';
import { isLoggedIn, login } from './auth';
import * as Spotify from './spotifyAPI';

import logo from './logo.svg';
import './App.css';
import { Playlists } from './Playlists';
import { Tracks } from './Tracks';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: isLoggedIn()
    };
  }

  componentDidMount() {
    if (this.state.loggedIn) {
      Spotify.getUser().then(user => this.setState({ user }));
      Spotify.getUserPlaylists().then(playlists => this.setState({ playlists }));
    }
  }

  getPlaylistTracks = (playlist) => {
    const { id } = this.state.user;
    this.setState({ currentPlaylist: playlist });
    return Spotify.getPlaylistTracks(id, playlist.id)
      .then(tracks => this.setState( { tracks }));
  };

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome {this.state.user && this.state.user.display_name}</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        {!this.state.loggedIn && <button onClick={login}>Login</button>}
        <Playlists
          playlists={this.state.playlists}
          current={this.state.currentPlaylist}
          getTracks={this.getPlaylistTracks} 
        />
        <Tracks tracks={this.state.tracks}/>

      </div>
    );
  }
}

export default App;
