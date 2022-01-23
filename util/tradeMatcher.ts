import { USD } from '@dinero.js/currencies';
import { add, dinero, Dinero, multiply, toSnapshot, toUnit } from 'dinero.js';
import _ from 'lodash';
import { Execution, ExecutionType, Trade } from '../model';

interface TradeContext {
  outstandingQuantity: number;
  currentTrade: Trade;
  cumulativePl: Dinero<number>;
}

class TradeContextImpl {
  private trade_: Trade;

  constructor(execution: Execution) {
    this.trade_ = {
      symbol: execution.symbol,
      quantity: execution.quantity,
      isOpen: true,
      isShort: execution.quantity < 0,
      executions: [execution],
      closedPl: toSnapshot(dinero({ amount: 0, currency: USD })),
      outflow: execution.totalOutflow,
    };
  }

  public get trade(): Trade {
    return this.trade_;
  }

  handleExecution(execution: Execution) {
    // TODO: Move implementation into here.
    return;
  }
}

export default class TradeMatcher {
  match(executions: Execution[]): Trade[] {
    return _.chain(executions)
      .groupBy('symbol')
      .flatMap((execs, symbol) => {
        const sortedByDate = _.sortBy(execs, (e) => e.timestamp.toMillis());
        return this.matchSymbolSequence(symbol, sortedByDate);
      })
      .value();
  }

  private matchSymbolSequence(
    symbol: string,
    executions: Execution[]
  ): Trade[] {
    const trades: Trade[] = [];
    let currentTradeContext: TradeContext | null = null;

    for (const execution of executions) {
      if (currentTradeContext) {
        switch (execution.executionType) {
          case ExecutionType.BUY_TO_OPEN:
            // If long, this is an add
            if (!currentTradeContext.currentTrade.isShort) {
              currentTradeContext.outstandingQuantity += execution.quantity;
              currentTradeContext.currentTrade.quantity += execution.quantity;
              currentTradeContext.currentTrade.executions.push(execution);
            } else {
              // Error?
              throw new Error('');
            }
            break;
          case ExecutionType.SELL_TO_CLOSE:
            // If long, this is a close.
            if (!currentTradeContext.currentTrade.isShort) {
              currentTradeContext.currentTrade.executions.push(execution);
              currentTradeContext.cumulativePl = add(
                currentTradeContext.cumulativePl,
                multiply(execution.totalOutflow, -1)
              );

              currentTradeContext.currentTrade.closedPl = toSnapshot(
                currentTradeContext.cumulativePl
              );

              if (
                currentTradeContext.outstandingQuantity + execution.quantity ===
                0
              ) {
                currentTradeContext.currentTrade.isOpen = false;
                trades.push(currentTradeContext.currentTrade);
                currentTradeContext = null;
              }
            } else {
              // Error?
              throw new Error('');
            }
            break;
          case ExecutionType.SELL_TO_OPEN:
            if (currentTradeContext.currentTrade.isShort) {
              currentTradeContext.outstandingQuantity -= execution.quantity;
              currentTradeContext.currentTrade.quantity -= execution.quantity;
              currentTradeContext.currentTrade.executions.push(execution);
            } else {
              // Error?
              throw new Error('');
            }
            // If short this is an add.
            break;
          case ExecutionType.BUY_TO_CLOSE:
            // If short this is a close.
            if (currentTradeContext.currentTrade.isShort) {
              currentTradeContext.currentTrade.executions.push(execution);
              currentTradeContext.cumulativePl = add(
                currentTradeContext.cumulativePl,
                multiply(execution.totalOutflow, -1)
              );

              currentTradeContext.currentTrade.closedPl = toSnapshot(
                currentTradeContext.cumulativePl
              );

              if (
                currentTradeContext.outstandingQuantity + execution.quantity ===
                0
              ) {
                currentTradeContext.currentTrade.isOpen = false;
                trades.push(currentTradeContext.currentTrade);
                currentTradeContext = null;
              }
            } else {
              // Error?
              throw new Error('');
            }
            break;
        }
      } else {
        // New trade started
        if (
          execution.executionType === ExecutionType.BUY_TO_OPEN ||
          execution.executionType === ExecutionType.SELL_TO_OPEN
        ) {
          currentTradeContext = {
            outstandingQuantity: execution.quantity,
            cumulativePl: multiply(execution.totalOutflow, -1),
            currentTrade: {
              symbol,
              quantity: execution.quantity,
              isOpen: true,
              isShort: execution.quantity < 0,
              executions: [execution],
              closedPl: toSnapshot(dinero({ amount: 0, currency: USD })),
              outflow: execution.totalOutflow,
            },
          };
        } else {
          // Not implemented, but if we had a new trade we would have to check
          // previously open trades to see if we closed something.
        }
      }
    }

    return trades;
  }
}