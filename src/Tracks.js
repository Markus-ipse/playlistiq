import React from 'react';

export function Tracks({ tracks }) {
  if (!tracks) return <p>No tracks</p>;
  return (
    <ul>
      {tracks.items.map(track => (
        <li key={track.track.id}>
          {track.track.name} - {track.track.artists.map(a => a.name).join(', ')}
        </li>
      ))}
    </ul>
  )
}
