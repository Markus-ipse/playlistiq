// @flow
import React from 'react';

type Props = {
  outputCount: number,
  min: number,
  max: number,
  increment: () => void,
  decrement: () => void,
  scramble: () => void,
  disabled: boolean,
};

export function ScrambleOptions({
  outputCount,
  min,
  max,
  increment,
  decrement,
  scramble,
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
            readOnly
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
      <p className="control ps-align-self-end">
        <button
          disabled={disabled}
          className="button is-primary"
          onClick={scramble}
        >
          Scramble
        </button>
      </p>
    </div>
  );
}
