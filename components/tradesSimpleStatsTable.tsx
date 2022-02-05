import {
  add,
  greaterThan,
  lessThan,
  maximum,
  minimum,
  toUnit,
} from 'dinero.js';
import _ from 'lodash';
import { useMemo } from 'react';
import { Trade } from '../model';
import { average, divide, sum, toUsdFormat, zero } from '../util/dineroUtil';
import { groupByDate } from '../util/tradeUtil';

interface Props {
  trades: Trade[];
}

export default function TradesSimpleStatsTable(props: Props) {
  const totalGainLoss = useMemo(() => {
    return _.reduce(
      props.trades,
      (acc, trade) => {
        return add(acc, trade.closedPl);
      },
      zero()
    );
  }, [props.trades]);

  const maxGain = useMemo(() => {
    if (props.trades.length > 0) {
      return maximum(props.trades.map((trade) => trade.closedPl));
    } else {
      return zero();
    }
  }, [props.trades]);

  const maxLoss = useMemo(() => {
    if (props.trades.length > 0) {
      return minimum(props.trades.map((trade) => trade.closedPl));
    } else {
      return zero();
    }
  }, [props.trades]);

  const averageDailyPL = useMemo(() => {
    if (props.trades.length === 0) {
      return zero();
    }

    const grouped = groupByDate(props.trades, 'day');
    const numDays = grouped.length;

    if (numDays === 0) {
      return zero();
    }

    const dailyCumulative = grouped
      .map((pair) => pair[1])
      .map((trades) => {
        return _.reduce(
          trades,
          (acc, trade) => {
            return add(acc, trade.closedPl);
          },
          zero()
        );
      });

    return divide(sum(dailyCumulative), numDays);
  }, [props.trades]);

  const averageWinner = useMemo(() => {
    return average(
      props.trades
        .filter((trade) => greaterThan(trade.closedPl, zero()))
        .map((trade) => trade.closedPl)
    );
  }, [props.trades]);

  const averageLoser = useMemo(() => {
    return average(
      props.trades
        .filter((trade) => lessThan(trade.closedPl, zero()))
        .map((trade) => trade.closedPl)
    );
  }, [props.trades]);

  const winLossPercent = useMemo(() => {
    const [wins, losses] = _.partition(props.trades, (trade) =>
      greaterThan(trade.closedPl, zero())
    );
    return {
      numWins: wins.length,
      numLosses: losses.length,
      winPct: Math.round(100 * (wins.length / props.trades.length)),
      lossPct: Math.round(100 * (losses.length / props.trades.length)),
      profitFactor: _.round(
        toUnit(sum(_.map(wins, 'closedPl'))) /
          Math.abs(toUnit(sum(_.map(losses, 'closedPl')))),
        3
      ),
    };
  }, [props.trades]);

  return (
    <div
      className='p-10" 
    overflow-hidden rounded-t-xl bg-gradient-to-b  from-slate-100'
    >
      <table className="standard-table table-auto">
        <tbody>
          <tr>
            <td>Total gain/loss: </td>
            <td>{toUsdFormat(totalGainLoss)}</td>
            <td>Largest gain: </td>
            <td>{toUsdFormat(maxGain)}</td>
            <td>Average winner: </td>
            <td>{toUsdFormat(averageWinner)}</td>
            <td>Total trades: </td>
            <td>{props.trades.length}</td>
            <td>Number of winning trades: </td>
            <td>{`${winLossPercent.numWins} (${winLossPercent.winPct}%)`}</td>
          </tr>
          <tr>
            <td>Average daily P/L: </td>
            <td>{toUsdFormat(averageDailyPL)}</td>
            <td>Largest loss: </td>
            <td>{toUsdFormat(maxLoss)}</td>
            <td>Average loss: </td>
            <td>{toUsdFormat(averageLoser)}</td>
            <td>Number of losing trades: </td>
            <td>
              {`${winLossPercent.numLosses} (${winLossPercent.lossPct}%)`}
            </td>
            <td>Profit factor:</td>
            <td>{winLossPercent.profitFactor}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
