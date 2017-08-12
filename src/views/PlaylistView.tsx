import * as classNames from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';

import * as Actions from '../actions/index';
import { CreatePlaylistOptions } from '../components/CreatePlaylistOptions';
import { TrackTable } from '../components/TrackTable';
import * as Select from '../reducers/selectors';
import { getTotalPlayTime } from '../util/helpers';

import { Action } from '../actions/index';
import { playTracks } from '../api/spotifyAPI';
import { Icon } from '../components/Icon';
import { AppState } from '../reducers/index';
import { TrackWithMeta } from '../reducers/selectors';
import { Dispatch, Playlist } from '../types/index';
import { chunkArray } from '../util/chunkArray';

interface OwnProps {
  playlist: Playlist;
  handleBackClick: () => void;
}

type StateProps = {
  isPending: boolean;
  tracks: TrackWithMeta[];
  isScrambled: boolean;
} & OwnProps;

interface DispatchProps {
  scrambleTracks: () => Action;
  createPlaylists: (splitTracks: TrackWithMeta[][]) => Action;
}

interface State {
  playlistCount: number;
  expanded: number[];
  createOptionsActive: boolean;
}

type Props = StateProps & DispatchProps;

export class PlaylistView extends React.Component<Props, State> {
  state: State = {
    playlistCount: 1,
    expanded: [],
    createOptionsActive: false,
  };

  increment = () =>
    this.setState(state => ({
      playlistCount: state.playlistCount + 1,
    }));
  decrement = () =>
    this.setState(state => ({
      playlistCount: state.playlistCount - 1,
    }));
  toggleExpanded = (clicked: number) =>
    this.setState(state => {
      const newState = state.expanded.includes(clicked)
        ? state.expanded.filter(n => n !== clicked)
        : state.expanded.concat(clicked);
      return { expanded: newState };
    });

  toggleCreateOptions = () =>
    this.setState(state => ({
      createOptionsActive: !state.createOptionsActive,
    }));

  render() {
    const {
      tracks,
      playlist,
      handleBackClick,
      isPending,
      isScrambled,
      createPlaylists,
      scrambleTracks,
    } = this.props;

    const { playlistCount, expanded, createOptionsActive } = this.state;
    if (!tracks) {
      return <p>No tracks</p>;
    }
    const splitTracks =
      isPending || !tracks.length
        ? [tracks]
        : chunkArray(tracks, playlistCount);

    const isSplit = splitTracks.length > 1;

    const createDisabled = playlistCount === 1 && !isScrambled;

    return (
      <div>
        <button className="button" onClick={handleBackClick}>
          Back to playlists
        </button>
        <div className="ps-m">
          <h2 className="title">
            {playlist.name}
          </h2>
          <p className="subtitle">
            {playlist.tracks.total} songs
            {!isPending &&
              <span>
                ,
                {getTotalPlayTime(tracks)}
              </span>}
          </p>
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
          <div className="field">
            <div className="control">
              <button
                className="button is-primary"
                disabled={isPending}
                onClick={() => playTracks(splitTracks[0].map(t => t.track.uri))}
              >
                <span className="icon">
                  <Icon type="play" color="#fff" className="ps-space-r" />
                </span>
                <span>Play as queue</span>
              </button>
            </div>
          </div>
          <div className="field has-addons">
            <div className="control">
              <button
                className="button is-primary"
                disabled={isPending || createDisabled}
                onClick={() => createPlaylists(splitTracks)}
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
                  'is-active': createOptionsActive,
                })}
                onClick={this.toggleCreateOptions}
              >
                <Icon type="options" />
              </button>
            </div>
          </div>

          {createOptionsActive &&
            <CreatePlaylistOptions
              disabled={isPending}
              outputCount={playlistCount}
              increment={this.increment}
              decrement={this.decrement}
              min={1}
              max={tracks.length / 5}
            />}
        </div>
        {splitTracks.map((newTrackList, i) =>
          <TrackTable
            isActive={expanded.includes(i + 1)}
            onHeaderClick={this.toggleExpanded}
            key={'table' + i}
            partNumber={isSplit ? i + 1 : null}
            tracks={newTrackList}
          />,
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: AppState, props: OwnProps): StateProps => ({
  isPending: Select.tracksPending(state, props.playlist.id),
  tracks: Select.playlistTracks(state, props.playlist.id),
  isScrambled: Select.isScrambled(state, props.playlist.id),
  ...props,
});

const mapDispatchToProps = (
  dispatch: Dispatch,
  ownProps: OwnProps,
): DispatchProps => ({
  scrambleTracks: () => dispatch(Actions.scrambleTracks(ownProps.playlist)),
  createPlaylists: splitTracks =>
    dispatch(Actions.createPlaylists(ownProps.playlist, splitTracks)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistView);
