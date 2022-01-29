import { Dinero, toFormat, add, toUnit } from 'dinero.js';
import _ from 'lodash';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { Column, useTable } from 'react-table';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Trade } from '../model';
import { dineroFromSnapshot, zero } from '../util/dineroUtil';
import { groupByDate } from '../util/tradeUtil';

interface Props {
  trades: Trade[];
}

interface TableData {
  symbol: string;
  numExecutions: number;
  timeOpened: string;
  longOrShort: string;
  realizedPL: string;
}

export default function TradesTable(props: Props) {
  const columns = useMemo<Column<TableData>[]>(
    () => [
      {
        Header: 'Symbol',
        accessor: 'symbol',
      },
      {
        Header: 'Executions',
        accessor: 'numExecutions',
      },
      {
        Header: 'Opened',
        accessor: 'timeOpened',
      },
      {
        Header: 'Long/Short',
        accessor: 'longOrShort',
      },
      {
        Header: 'Realized P/L',
        accessor: 'realizedPL',
      },
    ],
    []
  );

  const data = useMemo<TableData[]>(() => {
    return props.trades.map<TableData>((trade) => {
      return {
        symbol: trade.symbol,
        numExecutions: trade.executions.length,
        timeOpened: trade.executions[0].timestamp.toISO(),
        longOrShort: trade.isShort ? 'Short' : 'Long',
        realizedPL: toFormat(
          trade.closedPl,
          ({ amount, currency }) => `$${amount} ${currency.code}`
        ),
      } as TableData;
    });
  }, [props.trades]);

  const fmtMoney = (d: Dinero<number>) => {
    return toFormat(d, ({ amount, currency }) => `$${amount} ${currency.code}`);
  };

  const calcPL = (trades: Trade[]): Dinero<number> => {
    if (trades.length === 0) {
      return zero();
    }

    const start = trades[0].closedPl;

    return _.chain(trades)
      .drop(1)
      .reduce((acc, trade) => {
        return add(start, trade.closedPl);
      }, start)
      .value();
  };

  const chartData = useMemo(() => {
    if (props.trades.length === 0) {
      console.log('em');
      return [];
    }

    const x = _.map(props.trades, (trade) => {
      return [trade.executions[0].timestamp.startOf('day'), trade];
    });

    const byDate = groupByDate(props.trades);

    console.log(byDate, 'hel');
    const cumPl: { name: DateTime; y: Dinero<number> }[] = [];
    for (let i = 0; i < byDate.length; i++) {
      const [date, trades] = byDate[i];
      let val;
      if (i === 0) {
        val = calcPL(trades);
      } else {
        val = add(cumPl[i - 1].y, calcPL(trades));
      }
      cumPl.push({ name: date, y: val });
    }

    return _.map(cumPl, (datum) => ({
      name: datum.name.toFormat('yyyy-MM-dd'),
      y: toUnit(datum.y),
    }));
  }, [props.trades]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <div
      className="overflow-hidden 
      rounded-t-xl bg-gradient-to-b from-slate-100  p-10"
    >
      <table {...getTableProps()} className="table-fixed">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              className="border-b border-slate-100 p-4 pl-8 
              text-slate-500 dark:border-slate-700 dark:text-slate-400"
            >
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className="border-b border-slate-100 p-4 pl-8 
                text-slate-500 dark:border-slate-700 dark:text-slate-400"
              >
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <AreaChart
        width={730}
        height={250}
        data={chartData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="y"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorUv)"
        />
        {/* <Area
          type="monotone"
          dataKey="pv"
          stroke="#82ca9d"
          fillOpacity={1}
          fill="url(#colorPv)"
        /> */}
      </AreaChart>
    </div>
  );
}
