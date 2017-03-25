import React from 'react';

export function Playlists({ playlists, getTracks, current }) {
  if (!playlists) return <p>No Playlists</p>;
  return (
    <ul>
      {playlists.items.map(pl => (
        <li key={pl.id} onClick={() => getTracks(pl)}>
          {pl.name} {current && current.id === pl.id && '**'}
        </li>
      ))}
    </ul>
  )
}
