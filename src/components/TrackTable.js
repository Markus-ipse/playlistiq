// @flow
import React from 'react';
import format from 'date-fns/format';
import classNames from 'classnames';
import scrollIntoView from 'scroll-into-view';
import { getTotalPlayTime } from '../util/helpers';
import { SpotifyLink } from './SpotifyLink';
import { Icon } from './Icon';

import type { Track } from '../types/spotify';
import type { TrackWithMeta } from '../reducers/selectors';

import './TrackTable.css';

type Props = {
  tracks: TrackWithMeta[],
  partNumber: ?number,
  isActive: boolean,
  onHeaderClick: (partNumber: ?number) => void,
};

const getArtist = (track: Track) => track.artists.map(a => a.name).join(', ');

export function TrackTable({
  tracks,
  partNumber,
  onHeaderClick,
  isActive,
}: Props) {
  const activeOrSingle = isActive || partNumber === null;

  const clickHandler = (e: MouseEvent) => {
    const elem = e.currentTarget;
    if (!isActive && elem instanceof HTMLElement) {
      window.setTimeout(() => scrollIntoView(elem, {
        align: {
          top: 0,
        },
      }), 100);
    }
    onHeaderClick(partNumber);
  };

  const headerClasses = classNames('TrackTable-header', {
    'is-open': isActive,
  });

  return (
    <div className="playlist">
      {partNumber &&
        <div className={headerClasses} onClick={clickHandler}>
          Pt. {partNumber} ({tracks.length} songs, {getTotalPlayTime(tracks)})
          {isActive && <strong>*</strong>}
        </div>}
      {activeOrSingle &&
        <table className="table is-narrow is-striped ps-no-wrap">
          <colgroup>
            <col className="TrackTable-numCol" />
            <col />
            <col />
            <col className="TrackTable-dateCol" />
            <col className="TrackTable-spotifyLinkCol" />
          </colgroup>
          <thead>
            <tr>
              <th>#</th>
              <th>Song</th>
              <th>Artist</th>
              <th>Added</th>
              <th>
                <Icon type="spotify" />
              </th>
            </tr>
          </thead>
          <tbody>
            {tracks.map((item, i) =>
              <tr key={item.id}>
                <td>
                  {i + 1}
                </td>
                <td title={item.track.name}>
                  {item.track.name}
                </td>
                <td title={getArtist(item.track)}>
                  {getArtist(item.track)}
                </td>
                <td>
                  <span className="TrackTable-date-col">
                    {format(item.addedAt, 'YYYY-MM-DD')}
                  </span>
                  <span className="TrackTable-time">
                    {format(item.addedAt, 'HH:mm')}
                  </span>
                </td>
                <td>
                  <SpotifyLink uri={item.track.uri} />
                </td>
              </tr>,
            )}
          </tbody>
        </table>}
    </div>
  );
}
