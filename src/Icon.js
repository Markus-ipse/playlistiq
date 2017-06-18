import * as React from 'react';

const icons = {
  external: {
    path:
      'M22 14.5v5c0 2.484-2.016 4.5-4.5 4.5h-13c-2.484 0-4.5-2.016-4.5-4.5v-13c0-2.484 2.016-4.5 4.5-4.5h11c0.281 0 0.5 0.219 0.5 0.5v1c0 0.281-0.219 0.5-0.5 0.5h-11c-1.375 0-2.5 1.125-2.5 2.5v13c0 1.375 1.125 2.5 2.5 2.5h13c1.375 0 2.5-1.125 2.5-2.5v-5c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM28 1v8c0 0.547-0.453 1-1 1-0.266 0-0.516-0.109-0.703-0.297l-2.75-2.75-10.187 10.187c-0.094 0.094-0.234 0.156-0.359 0.156s-0.266-0.063-0.359-0.156l-1.781-1.781c-0.094-0.094-0.156-0.234-0.156-0.359s0.063-0.266 0.156-0.359l10.187-10.187-2.75-2.75c-0.187-0.187-0.297-0.438-0.297-0.703 0-0.547 0.453-1 1-1h8c0.547 0 1 0.453 1 1z',
    viewBox: '0 0 28 28',
  },
  shuffle: {
    path:
      'M10.406 7.516c-0.875 1.344-1.516 2.797-2.141 4.266-0.906-1.891-1.906-3.781-4.266-3.781h-3.5c-0.281 0-0.5-0.219-0.5-0.5v-3c0-0.281 0.219-0.5 0.5-0.5h3.5c2.781 0 4.828 1.297 6.406 3.516zM28 20c0 0.125-0.047 0.266-0.141 0.359l-5 5c-0.094 0.094-0.234 0.141-0.359 0.141-0.266 0-0.5-0.234-0.5-0.5v-3c-4.641 0-7.5 0.547-10.391-3.516 0.859-1.344 1.5-2.797 2.125-4.266 0.906 1.891 1.906 3.781 4.266 3.781h4v-3c0-0.281 0.219-0.5 0.5-0.5 0.141 0 0.266 0.063 0.375 0.156l4.984 4.984c0.094 0.094 0.141 0.234 0.141 0.359zM28 6c0 0.125-0.047 0.266-0.141 0.359l-5 5c-0.094 0.094-0.234 0.141-0.359 0.141-0.266 0-0.5-0.219-0.5-0.5v-3h-4c-2.078 0-3.063 1.422-3.938 3.109-0.453 0.875-0.844 1.781-1.219 2.672-1.734 4.031-3.766 8.219-8.844 8.219h-3.5c-0.281 0-0.5-0.219-0.5-0.5v-3c0-0.281 0.219-0.5 0.5-0.5h3.5c2.078 0 3.063-1.422 3.938-3.109 0.453-0.875 0.844-1.781 1.219-2.672 1.734-4.031 3.766-8.219 8.844-8.219h4v-3c0-0.281 0.219-0.5 0.5-0.5 0.141 0 0.266 0.063 0.375 0.156l4.984 4.984c0.094 0.094 0.141 0.234 0.141 0.359z',
    viewBox: '0 0 28 28',
  },
  spotify: {
    path:
      'M179.4 100.7c-36-21.4-95.3-23.3-129.7-13-5.5 1.8-11.4-1.4-13-7-1.7-5.4 1.4-11.2 7-13 39.4-12 105-9.6 146.4 15 5 3 6.7 9.4 3.7 14.3-3 5-9.3 6.6-14.3 3.7zm-1.2 31.7c-2.5 4-7.8 5.3-12 2.8-30-18.4-75.7-23.8-111.2-13-4.6 1.4-9.5-1.2-11-5.8-1.3-4.6 1.3-9.4 6-10.8 40.5-12.4 91-6.4 125.4 14.8 4 2.5 5.4 8 2.8 12zm-13.6 30.4c-2 3.2-6.3 4.3-9.6 2.3-26.2-16-59.2-19.6-98-10.7-3.8 1-7.6-1.5-8.4-5.2-1-3.7 1.5-7.4 5.2-8.3 42.5-9.7 79-5.5 108.5 12.5 3.2 2 4.3 6.3 2.3 9.6zm-51.2-161C51.7 1.7 1.7 51.7 1.7 113.3 1.7 175 51.7 225 113.4 225 175 225 225 175 225 113.4 225 51.7 175 1.7 113.4 1.7',
    viewBox: '0 0 226.73334 226.73334',
    fill: '#1ed760',
  },
};

type Props = {
  type: string,
  size: number,
};

export const Icon = ({ type, size = 21 }: Props) => {
  const icon = icons[type];
  return (
    <svg
      style={{verticalAlign: 'middle'}}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={icon.viewBox}
    >
      <path d={icon.path} fill={icon.fill}/>

    </svg>
  );
};
