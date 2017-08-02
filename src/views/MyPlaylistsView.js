// @flow
import React from 'react';
import { withStateHandlers } from 'recompose';
import { PlaylistTable } from '../components/PlaylistTable';
import ConfirmDialog from '../components/ConfirmDialog';

import type { Playlist } from '../types/index';
import type { HOC } from 'recompose';
import type { User } from '../types/spotify';

type EnhancedProps = {
  editMode: boolean,
  toggleEditMode: () => void,
  confirmDialogOpen: boolean,
  showConfirm: (Playlist[]) => void,
  closeConfirm: () => void,
  selected: Playlist[],
};

type InputProps = {
  user: User,
  playlists: Playlist[],
  getTracks: (p: Playlist) => void,
  onDelete: (Playlist[]) => void,
};

type FinalProps = InputProps & EnhancedProps;

export const MyPlaylistsView = ({
  user,
  playlists,
  getTracks,
  toggleEditMode,
  editMode,
  confirmDialogOpen,
  showConfirm,
  closeConfirm,
  selected,
  onDelete,
}: FinalProps) => {
  if (!playlists) return <p>No Playlists</p>;
  return (
    <section>
      <div className="actionBar">
        <div className="actionBar-title">My playlists</div>
        <button className="actionBar-edit button" onClick={toggleEditMode}>
          {editMode ? 'Done' : 'Edit'}
        </button>
      </div>
      <PlaylistTable
        user={user}
        playlists={playlists}
        getTracks={getTracks}
        editMode={editMode}
        showConfirm={showConfirm}
      />
      {confirmDialogOpen &&
        <ConfirmDialog
          title="Confirm deletion"
          confirmText="Delete"
          onConfirm={p => {
            console.log('Delete that shit', selected);
            onDelete(selected);
            closeConfirm();
          }}
          onCancel={closeConfirm}
        >
          Are you sure you want to delete:
          <ul>
            {selected.map(pl =>
              <li key={pl.id}>
                {pl.name}
              </li>,
            )}
          </ul>
        </ConfirmDialog>}
    </section>
  );
};

const enhance: HOC<*, InputProps> = withStateHandlers(
  {
    editMode: false,
    confirmDialogOpen: false,
    selected: [],
  },
  {
    toggleEditMode: state => () => ({
      editMode: !state.editMode,
      selected: [],
    }),
    showConfirm: state => (selected: Playlist[]) => ({
      confirmDialogOpen: true,
      selected: selected,
    }),
    closeConfirm: state => () => ({
      confirmDialogOpen: false,
    }),
  },
);

export default enhance(MyPlaylistsView);
