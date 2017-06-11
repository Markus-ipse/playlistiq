// @flow
import React from 'react';
import { connect } from 'react-redux';
import { withHandlers, withState, compose } from 'recompose';
import styled from 'styled-components';

import * as Select from './reducers/selectors';
import { scrambleTracks } from './actions/index';
import { ScrambleOptions } from './ScrambleOptions';
import { TrackTable } from './TrackTable';
import { chunkArray, getTotalPlayTime } from './util/helpers';

import type { SimplePlaylist } from './types/spotify';
import type { AppState } from './reducers/index';
import type { Dispatch } from './types/index';
import type { TrackWithMeta } from './reducers/selectors';

const PlaylistCollection = styled.div`
  @media (min-width: 1200px) {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 10px;
  }
`;

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
  expanded: TrackWithMeta[],
  setExpanded: any => void,
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
  expanded,
  setExpanded,
}: Props) {
  if (!tracks) return <p>No tracks</p>;
  const nextOffset = lastOffset + 100;
  const splitTracks = hasMore || !tracks.length
    ? [tracks]
    : chunkArray(tracks, playlistCount);

  const isSplit = splitTracks.length > 1;

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

      <PlaylistCollection>
        {splitTracks.map((trackChunk, i) =>
          <TrackTable
            isActive={trackChunk[0] === (expanded && expanded[0])}
            onHeaderClick={setExpanded}
            key={'table' + i}
            partNumber={isSplit ? i + 1 : null}
            tracks={trackChunk}
          />
        )}
      </PlaylistCollection>
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
  withState('expanded', 'setExpanded', null),
  withHandlers({
    increment: ({ setCount }) => () => setCount(n => n + 1),
    decrement: ({ setCount }) => () => setCount(n => n - 1),
  })
);

export default connect(mapStateToProps)(addCounting(Tracks));
