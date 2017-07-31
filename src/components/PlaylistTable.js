// @flow
import React from 'react';
import { Icon } from './Icon';

import type { Playlist } from '../types/index';
import { SpotifyLink } from './SpotifyLink';

import './PlaylistTable.css';

type Props = {
  playlists: Playlist[],
  getTracks: (p: Playlist) => void,
};

export const PlaylistTable = ({ playlists, getTracks }: Props) => (
  <table className="table is-striped ps-no-wrap PlaylistTable">
    <colgroup>
      <col />
      <col />
      <col className="PlaylistTable-spotifyLinkCol" />
    </colgroup>
    <thead>
      <tr>
        <th />
        <th>Playlist</th>
        <th>
          <Icon type="spotify" />
        </th>
      </tr>
    </thead>
    <tbody>
      {playlists.map(pl =>
        <tr key={pl.id}>
          <td className="PlaylistTable-checkboxCell">
            <label className="checkbox PlaylistTable-checkboxLabel">
              <input type="checkbox"/>
            </label>
          </td>
          <td onClick={() => getTracks(pl)}>
            {pl.name}
          </td>
          <td>
            <SpotifyLink uri={pl.uri} />
          </td>
        </tr>,
      )}
    </tbody>
  </table>
);
