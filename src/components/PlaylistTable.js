// @flow
import React from 'react';
import classNames from 'classnames';
import { SpotifyLink } from './SpotifyLink';
import { Icon } from './Icon';

import type { Playlist } from '../types/index';
import type { User } from '../types/spotify';

import './PlaylistTable.css';

type Props = {
  user: User,
  playlists: Playlist[],
  getTracks: (p: Playlist) => void,
  editMode: boolean,
  multiMode?: boolean,
  showConfirm: (pl: Playlist[]) => void,
};

export const PlaylistTable = ({
  user,
  playlists,
  getTracks,
  editMode,
  multiMode,
  showConfirm,
}: Props) =>
  <table className="table is-striped ps-no-wrap PlaylistTable">
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
                    className="delete"
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
