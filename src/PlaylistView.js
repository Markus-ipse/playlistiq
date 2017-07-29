// @flow
import React from 'react';
import { connect } from 'react-redux';
import { withStateHandlers, compose } from 'recompose';

import * as Select from './reducers/selectors';
import * as Actions from './actions/index';
import { ScrambleOptions } from './ScrambleOptions';
import { TrackTable } from './TrackTable';
import { chunkArray, getTotalPlayTime } from './util/helpers';

import type { AppState } from './reducers/index';
import type { Dispatch, Playlist } from './types/index';
import type { TrackWithMeta } from './reducers/selectors';
import type { Action } from './actions/index';

type OwnProps = {
  playlist: Playlist,
  handleBackClick: () => void,
};

type StateProps = {
  isPending: boolean,
  tracks: TrackWithMeta[],
  isScrambled: boolean,
} & OwnProps;

type DispatchProps = {
  scrambleTracks: () => Action,
  createPlaylists: (splitTracks: Array<TrackWithMeta[]>) => Action,
};

type HocProps = {
  playlistCount: number,
  increment: () => void,
  decrement: () => void,
  expanded: number[],
  toggleExpanded: (partNumber: ?number) => void,
};

type Props = StateProps & DispatchProps & HocProps;

export function PlaylistView({
  tracks,
  playlist,
  handleBackClick,
  isPending,
  playlistCount,
  increment,
  decrement,
  expanded,
  toggleExpanded,
  isScrambled,
  createPlaylists,
  scrambleTracks,
}: Props) {
  if (!tracks) return <p>No tracks</p>;
  const splitTracks =
    isPending || !tracks.length ? [tracks] : chunkArray(tracks, playlistCount);

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
          increment={increment}
          decrement={decrement}
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
          onHeaderClick={toggleExpanded}
          key={'table' + i}
          partNumber={isSplit ? i + 1 : null}
          tracks={newTrackList}
        />,
      )}
    </div>
  );
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

const addCounting = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStateHandlers(
    {
      playlistCount: 1,
      expanded: [],
    },
    {
      increment: ({ playlistCount }) => () => ({
        playlistCount: playlistCount + 1,
      }),
      decrement: ({ playlistCount }) => () => ({
        playlistCount: playlistCount - 1,
      }),
      toggleExpanded: ({ expanded }) => (clicked: number) => {
        const newState = expanded.includes(clicked)
          ? expanded.filter(n => n !== clicked)
          : expanded.concat(clicked);
        return { expanded: newState };
      },
    },
  ),
);

export default addCounting(PlaylistView);
