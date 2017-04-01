// @flow
import React from 'react';

import type { Paging, SimplePlaylist } from './types/spotify';

type Props = {
  playlists: ?Paging<SimplePlaylist>,
  getTracks: (p: SimplePlaylist) => void,
  current: ?SimplePlaylist
}
export function Playlists({ playlists, getTracks, current }: Props) {
  if (!playlists) return <p>No Playlists</p>;
  return (
    <table className="table ps-table">
      <thead>
      <tr>
        <th>Playlist</th>
      </tr>
      </thead>
      <tbody>
      {playlists.items.map(pl => (
        <tr key={pl.id} onClick={() => getTracks(pl)}>
          <td>
            {pl.name} {current && current.id === pl.id && '**'}
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  )
}
