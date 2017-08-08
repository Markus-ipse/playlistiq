import * as React from 'react';
import { Icon } from './Icon';
import { SpotifyLink } from './SpotifyLink';

import { Playlist } from '../types/index';
import { User } from '../types/spotify';

import * as classNames from 'classnames';
import './PlaylistTable.css';

interface Props {
  user: User;
  playlists: Playlist[];
  getTracks: (p: Playlist) => void;
  editMode: boolean;
  multiMode?: boolean;
  showConfirm: (pl: Playlist[]) => void;
}

export const PlaylistTable = ({
  user,
  playlists,
  getTracks,
  editMode,
  multiMode,
  showConfirm,
}: Props) =>
  <table className="table is-striped ps-no-wrap ps-layout-fixed">
    <colgroup>
      <col
        className={classNames('PlaylistTable-checkboxCol', {
          hiddenCol: !editMode,
        })}
      />
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
            {pl.owner.id === user.id &&
              (multiMode
                ? <label className="checkbox PlaylistTable-checkboxLabel">
                    <input type="checkbox" />
                  </label>
                : <span
                    className="delete ps-danger-bg"
                    onClick={() => showConfirm([pl])}
                  />)}
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
  </table>;
