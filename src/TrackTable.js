// @flow
import React from 'react';
import format from 'date-fns/format';
import { getTotalPlayTime } from './util/helpers';
import styled from 'styled-components';

import type { Track } from './types/spotify';
import type { TrackWithMeta } from './reducers/selectors';

const Header = styled.h2`
  border: 1px solid #ddd;
  padding: 1rem;
`;

type Props = {
  tracks: TrackWithMeta[],
  partNumber: ?number,
  isActive: boolean,
  onHeaderClick: any => void,
};

const getArtist = (track: Track) => track.artists.map(a => a.name).join(', ');

export function TrackTable({
  tracks,
  partNumber,
  onHeaderClick,
  isActive,
}: Props) {
  let classes = 'table is-narrow is-striped ps-table';
  if (!isActive && partNumber !== null) classes += ' is-hidden-mobile';

  return (
    <div className="playlist">
      {partNumber &&
        <Header onClick={() => onHeaderClick(isActive ? null : tracks)}>
          Pt. {partNumber} ({tracks.length} songs, {getTotalPlayTime(tracks)})
          {isActive && <strong>*</strong>}
        </Header>}
      <table className={classes}>
        <thead>
          <tr>
            <th>#</th>
            <th>Song</th>
            <th>Artist</th>
            <th>Added</th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((item, i) =>
            <tr key={item.id}>
              <td>{i + 1}</td>
              <td title={item.track.name}>{item.track.name}</td>
              <td title={getArtist(item.track)}>{getArtist(item.track)}</td>
              <td>{format(item.addedAt, 'YYYY-MM-DD HH:mm')}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
