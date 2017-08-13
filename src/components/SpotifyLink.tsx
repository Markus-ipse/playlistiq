import * as React from 'react';
import { Icon } from './Icon';

const stopPropagation = (e: React.MouseEvent<HTMLAnchorElement>) =>
  e.stopPropagation();

interface Props {
  uri: string;
  size?: number;
}

export const SpotifyLink = ({ uri, size }: Props) => {
  return (
    <a href={uri} onClick={stopPropagation} title="Open in Spotify">
      <Icon type="external" size={size} />
    </a>
  );
};
