export const chunkArray = <T>(
  arr: T[],
  chunks: number,
  useChunkSize?: boolean,
): T[][] => {
  if (chunks < 1) {
    throw new Error(
      `Invalid chunk ${useChunkSize
        ? 'size'
        : 'count'} (${chunks}). Must be at least 1 chunk`,
    );
  }
  if (!useChunkSize && chunks > arr.length) {
    throw new Error(
      `Invalid chunk count (${chunks}). Cannot have more chunks than items in the array (${arr.length})`,
    );
  }

  const chunkSize = useChunkSize ? chunks : arr.length / chunks;
  const groups = [];
  let i;

  for (i = 0; i < arr.length; i += chunkSize) {
    groups.push(arr.slice(i, i + chunkSize));
  }

  return groups;
};
