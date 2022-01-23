import { dinero, Dinero, DineroSnapshot } from 'dinero.js';

export function dineroFromSnapshot(
  snapshot: DineroSnapshot<number>
): Dinero<number> {
  return dinero({
    amount: snapshot.amount,
    currency: snapshot.currency,
    scale: snapshot.scale,
  });
}
