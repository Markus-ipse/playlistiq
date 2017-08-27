import * as classNames from 'classnames';
import { format } from 'date-fns';
import * as React from 'react';

import scrollIntoView from 'scroll-into-view';
import { getTotalPlayTime } from '../util/helpers';
import { Icon } from './Icon';
import { SpotifyLink } from './SpotifyLink';

import { TrackWithMeta } from '../reducers/selectors';
import { Track } from '../types/spotify';

import { playTracks } from '../api/spotifyAPI';
import './TrackTable.css';

interface Props {
  tracks: TrackWithMeta[];
  partNumber: number | null;
  isActive: boolean;
  onHeaderClick: (partNumber: number | null) => void;
}

const getArtist = (track: Track) => track.artists.map(a => a.name).join(', ');

export function TrackTable({
  tracks,
  partNumber,
  onHeaderClick,
  isActive,
}: Props) {
  const activeOrSingle = isActive || partNumber === null;

  const clickHandler = (e: React.MouseEvent<HTMLElement>) => {
    const elem = e.currentTarget;
    if (!isActive && elem instanceof HTMLElement) {
      window.setTimeout(
        () =>
          scrollIntoView(elem, {
            align: {
              top: 0,
            },
          }),
        100,
      );
    }
    onHeaderClick(partNumber);
  };

  const headerClasses = classNames('TrackTable-header', {
    'is-open': isActive,
  });

  return (
    <div className="playlist ps-fadeIn-up">
      {partNumber &&
        <div className={headerClasses} onClick={clickHandler}>
          Pt. {partNumber} ({tracks.length} songs, {getTotalPlayTime(tracks)})
          {isActive && <strong>*</strong>}
        </div>}
      {activeOrSingle &&
        <table className="TrackTable table is-narrow is-striped ps-layout-fixed ps-no-wrap">
          <colgroup>
            <col
              style={{ width: tracks.length.toString().length * 9.2 + 16 }}
            />
            <col />
            <col />
            <col />
            <col className="TrackTable-dateCol" />
            <col className="PlaylistTable-spotifyLinkCol" />
          </colgroup>
          <thead>
            <tr>
              <th>#</th>
              <th />
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
                <td>
                  <span
                    className="icon"
                    onClick={() => playTracks([item.track.uri])}
                  >
                    <Icon type="play" />
                  </span>
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
