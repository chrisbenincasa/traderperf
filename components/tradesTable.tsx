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
import { dineroFromSnapshot, toUsdFormat, zero } from '../util/dineroUtil';
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
        realizedPL: toUsdFormat(trade.closedPl),
      } as TableData;
    });
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
    </div>
  );
}
