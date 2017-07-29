// @flow
import React from 'react';
import { SpotifyLink } from './SpotifyLink';

import { Icon } from './Icon';
import type { Playlist } from './types/index';

type Props = {
  playlists: Playlist[],
  getTracks: (p: Playlist) => void,
};

export function Playlists({ playlists, getTracks }: Props) {
  if (!playlists) return <p>No Playlists</p>;
  return (
    <table className="table is-narrow is-stripe d ps-table">
      <thead>
        <tr>
          <th>Playlist</th>
          <th>
            <Icon type="spotify" />
          </th>
        </tr>
      </thead>
      <tbody>
        {playlists.map(pl =>
          <tr key={pl.id} onClick={() => getTracks(pl)}>
            <td>
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
}
