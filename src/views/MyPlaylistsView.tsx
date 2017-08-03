import * as React from 'react';
import ConfirmDialog from '../components/ConfirmDialog';
import { PlaylistTable } from '../components/PlaylistTable';

import { Playlist } from '../types/index';
import { User } from '../types/spotify';

interface Props {
  user: User,
  playlists: Playlist[],
  getTracks: (p: Playlist) => void,
  onDelete: (pl: Playlist[]) => void,
}

interface State {
  editMode: boolean,
  confirmDialogOpen: boolean,
  selected: Playlist[],
}

class MyPlaylistsView extends React.Component<Props, State> {
  state: State = {
    editMode: false,
    confirmDialogOpen: false,
    selected: [],
  };

  toggleEditMode = () =>
    this.setState(state => ({
      editMode: !state.editMode,
      selected: [],
    }));

  showConfirm = (selected: Playlist[]) =>
    this.setState({
      confirmDialogOpen: true,
      selected,
    });

  closeConfirm = () =>
    this.setState({
      confirmDialogOpen: false,
    });

  render() {
    const { user, playlists, getTracks, onDelete } = this.props;
    if (!playlists) return <p>No Playlists</p>;

    const { editMode, confirmDialogOpen, selected } = this.state;

    return (
      <section>
        <div className="actionBar">
          <div className="actionBar-title">
            My playlists ({user.display_name})
          </div>
          <button
            className="actionBar-edit button"
            onClick={this.toggleEditMode}
          >
            {this.state.editMode ? 'Done' : 'Edit'}
          </button>
        </div>
        <PlaylistTable
          user={user}
          playlists={playlists}
          getTracks={getTracks}
          editMode={editMode}
          showConfirm={this.showConfirm}
        />
        {confirmDialogOpen &&
          <ConfirmDialog
            title="Confirm deletion"
            confirmText="Delete"
            onConfirm={() => {
              console.log('Delete that shit', selected);
              onDelete(selected);
              this.closeConfirm();
            }}
            onCancel={this.closeConfirm}
          >
            Are you sure you want to delete:
            <ul>
              {selected.map(pl => (
                <li key={pl.id}>
                  {pl.name}
                </li>
              ))}
            </ul>
          </ConfirmDialog>}
      </section>
    );
  }
}

export default MyPlaylistsView;
