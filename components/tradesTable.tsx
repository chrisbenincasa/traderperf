import { Chip, Stack } from '@mui/material';
import { compare, Dinero } from 'dinero.js';
import _ from 'lodash';
import { useMemo } from 'react';
import { Column, Row, TableInstance, useSortBy, useTable } from 'react-table';
import { Trade } from '../model';
import { toUsdFormat } from '../util/dineroUtil';

interface Props {
  trades: Trade[];
}

interface TableData {
  id?: number;
  symbol: string;
  numExecutions: number;
  volume: number;
  timeOpened: string;
  longOrShort: string;
  realizedPL: Dinero<number>;
}

export default function TradesTable(props: Props) {
  const sortPl = useMemo(
    () => (rowA: Row<TableData>, rowB: Row<TableData>) => {
      const result = compare(
        rowA.original.realizedPL,
        rowB.original.realizedPL
      );
      return result;
    },
    []
  );

  const columns = useMemo<Column<TableData>[]>(
    () => [
      {
        Header: 'Symbol',
        accessor: 'symbol',
        Cell: (x) => {
          return <a href={`./trades/${x.row.original.id || 0}`}>{x.value}</a>;
        },
      },
      {
        Header: 'Executions',
        accessor: 'numExecutions',
      },
      {
        Header: 'Volume',
        accessor: 'volume',
        id: 'vol',
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
        Cell: (x) => toUsdFormat(x.value),
        sortType: sortPl,
      },
    ],
    []
  );

  const data = useMemo<TableData[]>(() => {
    return props.trades.map<TableData>((trade) => {
      if (trade.executions.length === 0) {
        console.log(trade);
      }
      return {
        id: trade.id,
        symbol: trade.symbol,
        volume: _.sum(trade.executions.map((e) => Math.abs(e.quantity))),
        numExecutions: trade.executions.length,
        timeOpened: trade.executions[0].timestamp.toISO(),
        longOrShort: trade.isShort ? 'Short' : 'Long',
        realizedPL: trade.closedPl,
      } as TableData;
    });
  }, [props.trades]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { sortBy },
  }: TableInstance<TableData> = useTable(
    { columns, data, initialState: { hiddenColumns: ['vol'] } },
    useSortBy
  );

  return (
    <div>
      <Stack direction="row">
        <Chip label="Sup"></Chip>
      </Stack>
      <table {...getTableProps()} className="table-2">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
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
