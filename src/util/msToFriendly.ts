export const msToFriendly = (millisec: number) => {
  const seconds = Math.round(millisec / 1000);
  let minutes = Math.round(seconds / 60);
  let hours = 0;
  if (minutes > 59) {
    hours = Math.floor(minutes / 60);
    minutes = minutes - hours * 60;
  }

  if (hours > 0) {
    return hours + ' hr ' + minutes + ' min';
  }
  return minutes + ' min';
};
