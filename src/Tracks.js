// @flow
import React from "react";
import { connect } from "react-redux";
import type { SimplePlaylist, Track } from "./types/spotify";
import type { AppState } from "./reducers/index";
import * as Select from "./reducers/selectors";
import {scrambleTracks} from "./actions/index";
import type {Dispatch} from "./types/index";

type Props = {
  tracks: Track[],
  playlist: SimplePlaylist,
  handleBackClick: () => void,
  getTracks: (offset: ?number) => void,
  hasMore: boolean,
  lastOffset: number,
  dispatch: Dispatch
};

const getArtist = (track: Track) => track.artists.map(a => a.name).join(", ");

export function Tracks({
  tracks,
  playlist,
  handleBackClick,
  getTracks,
  hasMore,
  lastOffset,
  dispatch,
}: Props) {
  if (!tracks) return <p>No tracks</p>;
  const nextOffset = lastOffset + 100;

  return (
    <div>
      <h2 className="title">{playlist.name}</h2>
      <p className="subtitle">{playlist.tracks.total} songs</p>

      <button className="button" onClick={handleBackClick}>
        Back to playlists
      </button>

      {hasMore &&
        <button className="button" onClick={() => getTracks()}>
          Fetch All tracks
        </button>}

      {!hasMore && <button className="button" onClick={() => dispatch(scrambleTracks(playlist))}>Scramble</button>}

      <table className="table is-narrow ps-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Song</th>
            <th>Artist</th>
            <th>Added</th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((track: Track, i) => (
            <tr key={track.id + track.add_at}>
              <td>{i + 1}</td>
              <td title={track.name}>{track.name}</td>
              <td title={getArtist(track)}>{getArtist(track)}</td>
              <td>{track.added_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
    tracks: Select.playlistTracks(state, props.playlist.id)
  };
};

export default connect(mapStateToProps)(Tracks);
