// @flow
import React from 'react';
import type { Paging, PlaylistTrack } from './types/spotify';

type Props = {
  tracks: ?Paging<PlaylistTrack>;
  playlistTitle: string;
  handleBackClick: () => void;
}

const getArtist = (track: PlaylistTrack) => track.track.artists.map(a => a.name).join(', ');

export function Tracks({ tracks, playlistTitle, handleBackClick }: Props) {
  if (!tracks) return <p>No tracks</p>;
  // const t: Paging<PlaylistTrack> = tracks;
  const hasMore = tracks.next;

  return (
    <div>
      <h2 className="title">{playlistTitle}</h2>
      <button className="button" onClick={handleBackClick}>Back to playlists</button>
      <table className="table ps-table">
        <thead>
        <tr>
          <th>#</th>
          <th>Song</th>
          <th>Artist</th>
        </tr>
        </thead>
        <tbody>
        {tracks.items.map((track, i) => (
          <tr key={track.track.id}>
            <td>{i + 1}</td>
            <td title={track.track.name}>{track.track.name}</td>
            <td title={getArtist(track)}>{getArtist(track)}</td>
          </tr>
        ))}
        </tbody>
      </table>
      {hasMore &&
      <button className="button">Load rest of tracks</button>
      }
    </div>
  );
}
