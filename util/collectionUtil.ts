import _ from 'lodash';

export const average = (coll: number[]): number => {
  if (coll.length === 0) return 0;
  return _.sum(coll) / coll.length;
};
