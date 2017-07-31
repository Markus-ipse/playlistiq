// @flow
import React from 'react';
import { withStateHandlers } from 'recompose';
import { PlaylistTable } from '../components/PlaylistTable';

import type { Playlist } from '../types/index';
import type { HOC } from 'recompose'

type EnhancedProps = {
  editMode: boolean,
  toggleEditMode: () => void,
};

type InputProps = {
  playlists: Playlist[],
  getTracks: (p: Playlist) => void,
};

type FinalProps = InputProps & EnhancedProps;

export const MyPlaylistsView = ({ playlists, getTracks, toggleEditMode, editMode }: FinalProps) => {
  if (!playlists) return <p>No Playlists</p>;
  return (
    <section>
      <div className="actionBar">
        <div className="actionBar-title">My playlists</div>
        <button
          className="actionBar-edit button"
          onClick={toggleEditMode}
        >{editMode ? 'Done' : 'Edit' }</button>
      </div>
      <PlaylistTable playlists={playlists} getTracks={getTracks} />
    </section>
  );
};

const enhance: HOC<*, InputProps> = withStateHandlers({
  editMode: false,
}, {
  toggleEditMode: (state) => () => ({ editMode: !state.editMode })
});

export default enhance(MyPlaylistsView);
