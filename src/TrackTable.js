// @flow
import React from 'react';
import format from 'date-fns/format';

import type { Track } from './types/spotify';
import type { TrackWithMeta } from './reducers/selectors';

type Props = {
  tracks: TrackWithMeta[],
  partNumber: number,
};

const getArtist = (track: Track) => track.artists.map(a => a.name).join(', ');

export function TrackTable({ tracks, partNumber }: Props) {
  return (
    <div className="playlist">
      <h2 className="">Pt. {partNumber}</h2>
      <table className="table is-narrow is-striped ps-table">
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
            </tr>,
          )}
        </tbody>
      </table>
    </div>
  );
}
