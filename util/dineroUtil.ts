import { USD } from '@dinero.js/currencies';
import {
  add,
  allocate,
  Currency,
  dinero,
  Dinero,
  DineroSnapshot,
  greaterThan,
  lessThan,
  toFormat,
} from 'dinero.js';
import _ from 'lodash';

export function dineroFromSnapshot(
  snapshot: DineroSnapshot<number>
): Dinero<number> {
  return dinero({
    amount: snapshot.amount,
    currency: snapshot.currency,
    scale: snapshot.scale,
  });
}

export const zero = (currency: Currency<number> = USD) =>
  dinero({ amount: 0, currency });

export const divide = (dividend: Dinero<number>, divisor: number) => {
  const x = Math.round(10000 * (1 / divisor));
  return allocate(dividend, [x, 10000 - x])[0];
};

export const sum = (nums: Dinero<number>[]) => {
  return _.reduce(nums, (acc, curr) => add(acc, curr), zero());
};

export const average = (nums: Dinero<number>[]) => {
  if (nums.length === 0) {
    return zero();
  }

  return divide(sum(nums), nums.length);
};

export const min = (nums: Dinero<number>[]): Dinero<number> => {
  // Check currencies throughout

  if (nums.length === 0) {
    return zero();
  }

  let m = nums[0];
  for (let i = 1; i < nums.length; i++) {
    if (lessThan(nums[i], m)) {
      m = nums[i];
    }
  }

  return m;
};

export const max = (nums: Dinero<number>[]): Dinero<number> => {
  // Check currencies throughout
  if (nums.length === 0) {
    return zero();
  }

  let m = nums[0];
  for (let i = 1; i < nums.length; i++) {
    if (greaterThan(nums[i], m)) {
      m = nums[i];
    }
  }

  return m;
};

export const toUsdFormat = (d: Dinero<number>) => {
  return toFormat(d, ({ amount, currency }) => `$${amount} ${currency.code}`);
};
