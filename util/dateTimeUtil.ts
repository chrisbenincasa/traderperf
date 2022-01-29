import { DateTime } from 'luxon';

export const sortDateTimes = (dts: DateTime[]): DateTime[] => {
  return [...dts].sort((a, b) => a.toMillis() - b.toMillis());
};

export const sortDateTimePairs = <T>(dts: [DateTime, T][]): [DateTime, T][] => {
  return [...dts].sort((a, b) => a[0].toMillis() - b[0].toMillis());
};
