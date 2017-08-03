import * as React from 'react';
import { MouseEvent } from 'react';
import { Icon } from './Icon';

const stopPropagation = (e: MouseEvent<HTMLAnchorElement>) =>
  e.stopPropagation();

interface Props {
  uri: string;
  size?: number;
}

export const SpotifyLink = ({ uri, size = 16 }: Props) => {
  return (
    <a href={uri} onClick={stopPropagation} title="Open in Spotify">
      <Icon type="external" size={size} />
    </a>
  );
};
