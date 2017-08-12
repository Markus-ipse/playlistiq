import * as React from 'react';
import { connect } from 'react-redux';
import {
  deletePlaylists,
  fetchPlaylists,
  fetchTracks,
  fetchUser,
} from './actions/index';
import { login } from './api/spotifyAuth';
import * as Selectors from './reducers/selectors';
import MyPlaylistsView from './views/MyPlaylistsView';
import PlaylistView from './views/PlaylistView';

import { AppState } from './reducers/index';
import { UserState } from './reducers/userReducer';
import { Playlist } from './types/index';

import './App.css';

interface StateProps {
  user: UserState;
  playlists: Playlist[];
  playlistsPending: boolean;
}

interface DispatchProps {
  fetchUser: () => void;
  fetchPlaylists: () => void;
  deletePlaylists: (pls: Playlist[]) => void;
  fetchTracks: (pl: Playlist) => void;
}

type Props = StateProps & DispatchProps;

interface State {
  currentPlaylist: Playlist | null;
}

export class App extends React.Component<Props, State> {
  confirmDialog: HTMLInputElement | null;

  state: State = {
    currentPlaylist: null,
  };

  componentDidMount() {
    if (this.props.user.isLoggedIn) {
      this.props.fetchUser();
      this.props.fetchPlaylists();
    }
  }

  getPlaylistTracks = (playlist: Playlist) => {
    this.setState({ currentPlaylist: playlist });
    this.props.fetchTracks(playlist);
  };

  handleBackClick = () => {
    this.setState({ currentPlaylist: null });
  };

  handleLogin = () => {
    login(this.confirmDialog!.checked);
  };

  handleDeletePlaylists = (playlists: Playlist[]) => {
    this.props.deletePlaylists(playlists);
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
                  />
                  Show Spotify confirm dialog
                </label>
              </p>
            </div>}
          {!currentPlaylist &&
            user.data &&
            <MyPlaylistsView
              user={user.data}
              playlists={playlists}
              getTracks={this.getPlaylistTracks}
              onDelete={this.handleDeletePlaylists}
            />}
          {currentPlaylist &&
            user.data &&
            <PlaylistView
              playlist={currentPlaylist}
              handleBackClick={this.handleBackClick}
            />}
        </div>
      </div>
    );
  }
}

const boundActions = {
  fetchUser,
  fetchPlaylists,
  fetchTracks,
  deletePlaylists,
};

const mapStateToProps = (state: AppState): StateProps => ({
  user: state.user,
  playlists: Selectors.playlists(state),
  playlistsPending: Selectors.playlistsPending(state),
});

const Connected = connect(mapStateToProps, boundActions)(App);
export default Connected;
