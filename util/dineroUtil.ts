import { USD } from '@dinero.js/currencies';
import { Currency, dinero, Dinero, DineroSnapshot } from 'dinero.js';

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
