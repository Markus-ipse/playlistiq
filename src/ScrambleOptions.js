// @flow
import React from 'react';

type Props = {
  outputCount: number,
  min: number,
  max: number,
  increment: () => void,
  decrement: () => void,
  scramble: () => void,
};

export function ScrambleOptions({
  outputCount,
  min,
  max,
  increment,
  decrement,
  scramble,
}: Props) {
  return (
    <div className="field is-grouped">
      <div className="control">
        <label className="label" htmlFor="playlistCount">
          # of playlists to create
        </label>
        <div className="field has-addons">
          <p className="control">
            <button className="button" disabled={outputCount <= min} onClick={decrement}>-</button>
          </p>
          <input
            id="playlistCount"
            className="input"
            type="number"
            value={outputCount}
            readOnly
          />
          <p className="control">
            <button className="button" disabled={outputCount >= max} onClick={increment}>+</button>
          </p>
        </div>
      </div>
      <p className="control align-self-end">
        <button className="button is-primary" onClick={scramble}>
          Scramble
        </button>
      </p>
    </div>
  );
}
