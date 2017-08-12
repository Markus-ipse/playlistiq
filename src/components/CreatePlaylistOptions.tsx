import * as React from 'react';

interface Props {
  outputCount: number;
  min: number;
  max: number;
  increment: () => void;
  decrement: () => void;
  disabled: boolean;
}

export function CreatePlaylistOptions({
  outputCount,
  min,
  max,
  increment,
  decrement,
  disabled,
}: Props) {
  return (
    <div className="field is-grouped">
      <div className="control ps-shrink-1">
        <label className="label" htmlFor="playlistCount">
          # of playlists to create
        </label>
        <div className="field has-addons">
          <p className="control">
            <button
              className="button"
              disabled={disabled || outputCount <= min}
              onClick={decrement}
            >
              -
            </button>
          </p>
          <input
            id="playlistCount"
            className="input has-text-centered"
            type="number"
            value={outputCount}
            readOnly={true}
            disabled={disabled}
          />
          <p className="control">
            <button
              className="button"
              disabled={disabled || outputCount >= max}
              onClick={increment}
            >
              +
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
