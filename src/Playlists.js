// @flow
import React from 'react';

import type { Paging, SimplePlaylist } from './types/spotify';

type Props = {
  playlists: ?Paging<SimplePlaylist>;
  getTracks: (p: SimplePlaylist) => void;
}
export function Playlists({ playlists, getTracks }: Props) {
  if (!playlists) return <p>No Playlists</p>;
  return (
    <table className="table is-narrow ps-table">
      <thead>
      <tr>
        <th>Playlist</th>
      </tr>
      </thead>
      <tbody>
      {playlists.items.map(pl => (
        <tr key={pl.id} onClick={() => getTracks(pl)}>
          <td>
            {pl.name}
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  )
}
