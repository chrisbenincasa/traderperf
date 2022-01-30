import { USD } from '@dinero.js/currencies';
import { dinero, Dinero } from 'dinero.js';
import { DateTime } from 'luxon';
import { Execution, ExecutionType, Platform } from '../model';
import BaseParser, { ParseResult } from './base';

interface ParseContext {
  currentPos: number;
  parsedStockTransactions: Execution[];
}

function makeStartingContext(): ParseContext {
  return {
    currentPos: 0,
    parsedStockTransactions: [],
  };
}

export default class IbkrParser extends BaseParser {
  private static ACCOUNT_INFO_HEADER = 'ACCOUNT_INFORMATION';
  private static STOCK_TRANSACTIONS_HEADER = 'STOCK_TRANSACTIONS';

  platform(): Platform {
    return Platform.INTERACTIVE_BROKERS;
  }

  parse(input: string): ParseResult {
    const context = makeStartingContext();
    const lines = input.split('\n');

    while (context.currentPos < lines.length) {
      const line = lines[context.currentPos];
      if (line === 'EOF') {
        break;
      }

      if (line.length === 0) {
        context.currentPos++;
        continue;
      }

      switch (line) {
        case IbkrParser.ACCOUNT_INFO_HEADER:
          // Advance the position until we get empty lines. We don't need
          // account info.
          while (lines[context.currentPos].length > 0) {
            context.currentPos++;
          }
          break;
        case IbkrParser.STOCK_TRANSACTIONS_HEADER:
          context.currentPos++;
          context.parsedStockTransactions = this.parseStockTransactions(
            lines,
            context
          );
          break;
        default:
          console.warn('Unrecognized header: ' + line);
          break;
      }

      context.currentPos++;
    }

    return {
      executions: context.parsedStockTransactions,
    };
  }

  private parseStockTransactions(
    lines: string[],
    context: ParseContext
  ): Execution[] {
    let line = lines[context.currentPos];
    const transactions: Execution[] = [];
    while (line.length > 0) {
      transactions.push(this.parseStockTransaction(line));
      line = lines[++context.currentPos];
    }

    return transactions;
  }

  private parseStockTransaction(transactionLine: string): Execution {
    const transactionParts = transactionLine.split('|');
    const dt = DateTime.fromFormat(
      `${transactionParts[7]} ${transactionParts[8]}`,
      'yMMdd HH:mm:ss'
    );

    return {
      platform: this.platform(),
      symbol: transactionParts[2],
      executionType: this.convertExecutionType(transactionParts[5])!,
      timestamp: dt,
      quantity: parseFloat(transactionParts[10]),
      pps: this.createDinero(transactionParts[12]),
      totalOutflow: this.createDinero(transactionParts[13]),
    };
  }

  private createDinero(stringPrice: string): Dinero<number> {
    const dollarsAndCents = stringPrice.split('.', 2);
    if (dollarsAndCents.length === 1) {
      return dinero({
        amount: parseInt(dollarsAndCents[0] + '00'),
        currency: USD,
        scale: 2,
      });
    } else {
      const scale = dollarsAndCents[1].length;
      return dinero({
        amount: parseInt(stringPrice.replaceAll('.', '')),
        currency: USD,
        scale,
      });
    }
  }

  private convertExecutionType(type: string): ExecutionType | null {
    switch (type) {
      case 'BUYTOOPEN':
        return ExecutionType.BUY_TO_OPEN;
      case 'SELLTOOPEN':
        return ExecutionType.SELL_TO_OPEN;
      case 'BUYTOCLOSE':
        return ExecutionType.BUY_TO_CLOSE;
      case 'SELLTOCLOSE':
        return ExecutionType.SELL_TO_CLOSE;
      default:
        return null;
    }
  }
}
