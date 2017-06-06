// @flow
import React from 'react';
import { connect } from 'react-redux';
import { withHandlers, withState, compose } from 'recompose';

import * as Select from './reducers/selectors';
import { scrambleTracks } from './actions/index';
import { ScrambleOptions } from './ScrambleOptions';
import { TrackTable } from './TrackTable';
import { chunkArray, getTotalPlayTime } from './util/helpers';

import type { SimplePlaylist } from './types/spotify';
import type { AppState } from './reducers/index';
import type { Dispatch } from './types/index';
import type { TrackWithMeta } from './reducers/selectors';

type Props = {
  tracks: TrackWithMeta[],
  playlist: SimplePlaylist,
  handleBackClick: () => void,
  getTracks: (offset: ?number) => void,
  hasMore: boolean,
  lastOffset: number,
  dispatch: Dispatch,
  playlistCount: number,
  increment: () => void,
  decrement: () => void,
};

export function Tracks({
  tracks,
  playlist,
  handleBackClick,
  getTracks,
  hasMore,
  lastOffset,
  dispatch,
  playlistCount,
  increment,
  decrement,
}: Props) {
  if (!tracks) return <p>No tracks</p>;
  const nextOffset = lastOffset + 100;
  const splitTracks = hasMore || !tracks.length
    ? [tracks]
    : chunkArray(tracks, playlistCount);

  return (
    <div>
      <button className="button" onClick={handleBackClick}>
        Back to playlists
      </button>

      <h2 className="title">{playlist.name}</h2>
      <p className="subtitle">
        {playlist.tracks.total} songs
        {!hasMore &&
          <span>
            ,
            {getTotalPlayTime(tracks)}
          </span>}
      </p>

      {hasMore &&
        <button className="button" onClick={() => getTracks()}>
          Fetch All tracks
        </button>}

      {!hasMore &&
        <ScrambleOptions
          outputCount={playlistCount}
          increment={increment}
          decrement={decrement}
          min={1}
          max={tracks.length / 5}
          scramble={() => dispatch(scrambleTracks(playlist))}
        />}

      <div className="playlists">
        {splitTracks.map((trackChunk, i) =>
          <TrackTable key={'table' + i} partNumber={i + 1} tracks={trackChunk} />,
        )}
      </div>
      {hasMore &&
        <button className="button" onClick={() => getTracks(nextOffset)}>
          Load more
        </button>}
    </div>
  );
}

const mapStateToProps = (state: AppState, props: Props) => {
  const playlist = state.tracks.pages[props.playlist.id];
  return {
    hasMore: !!playlist.next,
    lastOffset: playlist.lastOffset,
    tracks: Select.playlistTracks(state, props.playlist.id),
  };
};

const addCounting = compose(
  withState('playlistCount', 'setCount', 1),
  withHandlers({
    increment: ({ setCount }) => () => setCount(n => n + 1),
    decrement: ({ setCount }) => () => setCount(n => n - 1),
  }),
);

export default connect(mapStateToProps)(addCounting(Tracks));
