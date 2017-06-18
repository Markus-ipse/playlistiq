// @flow
import React from 'react';
import format from 'date-fns/format';
import { getTotalPlayTime } from './util/helpers';
import { SpotifyLink } from './SpotifyLink';
import { Icon } from './Icon';

import type { Track } from './types/spotify';
import type { TrackWithMeta } from './reducers/selectors';

import './TrackTable.css';

type Props = {
  tracks: TrackWithMeta[],
  partNumber: ?number,
  isActive: boolean,
  onHeaderClick: (tracks: ?(TrackWithMeta[])) => void,
};

const getArtist = (track: Track) => track.artists.map(a => a.name).join(', ');

export function TrackTable({
  tracks,
  partNumber,
  onHeaderClick,
  isActive,
}: Props) {
  const activeOrSingle = isActive || partNumber === null;

  return (
    <div className="playlist">
      {partNumber &&
        <div
          className="TrackTable-header"
          onClick={() => onHeaderClick(isActive ? null : tracks)}
        >
          Pt. {partNumber} ({tracks.length} songs, {getTotalPlayTime(tracks)})
          {isActive && <strong>*</strong>}
        </div>}
      {activeOrSingle &&
        <table className="table is-narrow is-striped ps-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Song</th>
              <th>Artist</th>
              <th>Added</th>
              <th><Icon type="spotify" /></th>
            </tr>
          </thead>
          <tbody>
            {tracks.map((item, i) =>
              <tr key={item.id}>
                <td>{i + 1}</td>
                <td title={item.track.name}>{item.track.name}</td>
                <td title={getArtist(item.track)}>{getArtist(item.track)}</td>
                <td>{format(item.addedAt, 'YYYY-MM-DD HH:mm')}</td>
                <td><SpotifyLink uri={item.track.uri} /></td>
              </tr>,
            )}
          </tbody>
        </table>}
    </div>
  );
}
