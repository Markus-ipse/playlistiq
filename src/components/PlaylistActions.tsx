import * as classNames from 'classnames';
import * as React from 'react';
import { Action } from '../actions/index';
import { CreatePlaylistOptions } from './CreatePlaylistOptions';
import { Icon } from './Icon';
import './PlaylistActions.css';

interface Props {
  isPending: boolean;
  isScrambled: boolean;
  playlistCount: number;
  maxPlaylists: number;
  scrambleTracks: () => Action;
  createPlaylists: () => Action;
  playTracks: () => any;
  increment: () => void;
  decrement: () => void;
}

interface State {
  createOptionsActive: boolean;
}

export class PlaylistActions extends React.Component<Props, State> {
  state = {
    createOptionsActive: false,
  };

  toggleCreateOptions = () =>
    this.setState(state => ({
      createOptionsActive: !state.createOptionsActive,
    }));

  render() {
    const {
      isScrambled,
      isPending,
      playlistCount,
      maxPlaylists,
      scrambleTracks,
      playTracks,
      createPlaylists,
      increment,
      decrement,
    } = this.props;
    const createDisabled = playlistCount === 1 && !isScrambled;

    return (
      <div className="ps-fadeIn-up ps-delay-1">
        <div className="field has-addons">
          <div className="control">
            <button
              disabled={isPending}
              className="button"
              onClick={scrambleTracks}
            >
              <span className="icon">
                <Icon type="shuffle" />
              </span>
              <span>Scramble</span>
            </button>
          </div>
        </div>
        <div className="spotifyActionWrapper">
          <div className="field spotifyAction">
            <div className="control">
              <button
                className="button is-primary"
                disabled={isPending}
                onClick={playTracks}
              >
                <span className="icon">
                  <Icon type="play" color="#fff" className="ps-space-r" />
                </span>
                <span>Play as queue</span>
              </button>
            </div>
          </div>
          <div className="field has-addons spotifyAction">
            <div className="control">
              <button
                className="button is-primary"
                disabled={isPending || createDisabled}
                onClick={createPlaylists}
              >
                <span className="icon">
                  <Icon type="playlistAdd" />
                </span>{' '}
                <span>Create playlist(s)</span>
              </button>
            </div>
            <div className="control">
              <button
                className={classNames('button', {
                  'is-active': this.state.createOptionsActive,
                })}
                onClick={this.toggleCreateOptions}
              >
                <Icon type="options" />
              </button>
            </div>
          </div>
        </div>
        {this.state.createOptionsActive &&
          <CreatePlaylistOptions
            disabled={isPending}
            outputCount={playlistCount}
            increment={increment}
            decrement={decrement}
            min={1}
            max={maxPlaylists}
          />}
      </div>
    );
  }
}
