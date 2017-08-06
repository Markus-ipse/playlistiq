import * as React from 'react';
import { connect } from 'react-redux';

import * as Actions from '../actions/index';
import { ScrambleOptions } from '../components/ScrambleOptions';
import { TrackTable } from '../components/TrackTable';
import * as Select from '../reducers/selectors';
import { chunkArray, getTotalPlayTime } from '../util/helpers';

import { Action } from '../actions/index';
import { AppState } from '../reducers/index';
import { TrackWithMeta } from '../reducers/selectors';
import { Dispatch, Playlist } from '../types/index';

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
}

type Props = StateProps & DispatchProps;

export class PlaylistView extends React.Component<Props, State> {
  state: State = {
    playlistCount: 1,
    expanded: [],
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

    const { playlistCount, expanded } = this.state;
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

          <ScrambleOptions
            disabled={isPending}
            outputCount={playlistCount}
            increment={this.increment}
            decrement={this.decrement}
            min={1}
            max={tracks.length / 5}
            scramble={scrambleTracks}
          />

          <button
            className="button is-primary"
            disabled={isPending || createDisabled}
            onClick={() => createPlaylists(splitTracks)}
          >
            Create playlist(s)
          </button>
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
