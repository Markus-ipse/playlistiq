// @flow
import React from 'react';
import { connect } from 'react-redux';
import { withHandlers, withState, compose } from 'recompose';

import * as Select from './reducers/selectors';
import { scrambleTracks, createPlaylists } from './actions/index';
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
  isPending: boolean,
  dispatch: Dispatch,
  playlistCount: number,
  increment: () => void,
  decrement: () => void,
  expanded: TrackWithMeta[],
  setExpanded: (tracks: ?(TrackWithMeta[])) => void,
};

export function PlaylistView({
  tracks,
  playlist,
  handleBackClick,
  isPending,
  dispatch,
  playlistCount,
  increment,
  decrement,
  expanded,
  setExpanded,
}: Props) {
  if (!tracks) return <p>No tracks</p>;
  const splitTracks =
    isPending || !tracks.length ? [tracks] : chunkArray(tracks, playlistCount);

  const isSplit = splitTracks.length > 1;

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
          scramble={() => dispatch(scrambleTracks(playlist))}
        />

        {!isPending &&
          <button
            className="button is-primary"
            onClick={() => dispatch(createPlaylists(playlist, splitTracks))}
          >
            Create playlist(s)
          </button>}
      </div>
      {splitTracks.map((trackChunk, i) =>
        <TrackTable
          isActive={trackChunk[0] === (expanded && expanded[0])}
          onHeaderClick={setExpanded}
          key={'table' + i}
          partNumber={isSplit ? i + 1 : null}
          tracks={trackChunk}
        />,
      )}
    </div>
  );
}

const mapStateToProps = (state: AppState, props: Props) => {
  const playlist = state.tracks.pages[props.playlist.id];
  return {
    isPending: playlist.next !== null,
    tracks: Select.playlistTracks(state, props.playlist.id),
  };
};

const addCounting = compose(
  withState('playlistCount', 'setCount', 1),
  withState('expanded', 'setExpanded', null),
  withHandlers({
    increment: ({ setCount }) => () => setCount(n => n + 1),
    decrement: ({ setCount }) => () => setCount(n => n - 1),
  }),
);

export default connect(mapStateToProps)(addCounting(PlaylistView));
