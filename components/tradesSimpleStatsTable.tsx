import {
  add,
  greaterThan,
  lessThan,
  lessThanOrEqual,
  maximum,
  minimum,
  toUnit,
} from 'dinero.js';
import _ from 'lodash';
import { Duration } from 'luxon';
import { useMemo } from 'react';
import { Trade } from '../model';
import { average } from '../util/collectionUtil';
import {
  average as dineroAverage,
  divide,
  sum,
  toUsdFormat,
  zero,
} from '../util/dineroUtil';
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
    return dineroAverage(
      props.trades
        .filter((trade) => greaterThan(trade.closedPl, zero()))
        .map((trade) => trade.closedPl)
    );
  }, [props.trades]);

  const averageLoser = useMemo(() => {
    return dineroAverage(
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

  const tradeDuration = (trade: Trade) => {
    const open = _.first(trade.executions)!.timestamp;
    const close = _.last(trade.executions)!.timestamp;
    return close.diff(open).as('seconds');
  };

  const holdingTime = useMemo(() => {
    const closedTrades = _.filter(props.trades, (trade) => !trade.isOpen);
    const durations = _.map(closedTrades, tradeDuration);
    return {
      all: average(durations),
      winners: average(
        _.chain(closedTrades)
          .filter((trade) => greaterThan(trade.closedPl, zero()))
          .map(tradeDuration)
          .value()
      ),
      losers: average(
        _.chain(closedTrades)
          .filter((trade) => lessThanOrEqual(trade.closedPl, zero()))
          .map(tradeDuration)
          .value()
      ),
    };
  }, [props.trades]);

  const stddev = useMemo(() => {}, [props.trades]);

  return (
    <div className="overflow-hidden rounded-t-xl p-10">
      {/* <div className="flex divide-x-2 border-2">
        <div className="flex flex-1">
          <div className="grow px-6 py-4">Total gain/loss: </div>
          <div className="py-4 pr-8">{toUsdFormat(totalGainLoss)}</div>
        </div>
        <div className="flex flex-1">
          <div className="grow px-6 py-4">Largest gain: </div>
          <div className="py-4 pr-8">{toUsdFormat(maxGain)}</div>
        </div>
      </div> */}
      <table className="table-2">
        <tbody>
          <tr>
            <td>Total gain/loss: </td>
            <td>{toUsdFormat(totalGainLoss)}</td>
            <td>Largest gain: </td>
            <td>{toUsdFormat(maxGain)}</td>
          </tr>
          <tr>
            <td>Average winner: </td>
            <td>{toUsdFormat(averageWinner)}</td>
            <td>Largest loss: </td>
            <td>{toUsdFormat(maxLoss)}</td>
          </tr>
          <tr>
            <td>Number of winning trades: </td>
            <td>{`${winLossPercent.numWins} (${winLossPercent.winPct}%)`}</td>
            <td>Average hold time (winners):</td>
            <td>
              {Duration.fromObject({ seconds: holdingTime.winners })
                .shiftTo('minutes')
                .toHuman({
                  unitDisplay: 'short',
                })}
            </td>
          </tr>
          <tr>
            <td>Number of losing trades: </td>
            <td>
              {`${winLossPercent.numLosses} (${winLossPercent.lossPct}%)`}
            </td>
            <td>Total trades: </td>
            <td>{props.trades.length}</td>
          </tr>
          <tr>
            <td>Average loss: </td>
            <td>{toUsdFormat(averageLoser)}</td>
            <td>Average daily P/L: </td>
            <td>{toUsdFormat(averageDailyPL)}</td>
          </tr>
          <tr>
            <td>Profit factor:</td>
            <td>{winLossPercent.profitFactor}</td>
            <td>Average hold time (losers):</td>
            <td>
              {Duration.fromObject({ seconds: holdingTime.losers })
                .shiftTo('minutes')
                .toHuman({
                  unitDisplay: 'short',
                })}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
