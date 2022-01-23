import type { NextPage } from 'next';
import { ChangeEvent, useRef, useState } from 'react';
import { Trade } from '../../model';
import IbkrParser from '../../parsers/ibkr_parser';
import TradeMatcher from '../../util/tradeMatcher';

const ImportTrades: NextPage = () => {
  const fileInputEl = useRef<HTMLInputElement | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);

  const handleSubmit = function (event: ChangeEvent<HTMLInputElement>) {
    const reader = new FileReader();

    reader.onload = (readerOnLoad) => {
      const result = new IbkrParser().parse(
        readerOnLoad.target?.result as string
      );
      setTrades(new TradeMatcher().match(result.executions));
    };

    if (event.target.files) {
      for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i];
        reader.readAsText(file);
      }
    }
  };

  const handleClear = function () {
    if (fileInputEl.current) {
      fileInputEl.current.value = '';
    }
  };

  const tradeList = trades.map((trade) => {
    const key = `${trade.symbol}_ ${trade.executions[0].timestamp.toMillis()}`;
    return (
      <tr key={key}>
        <td>{trade.symbol}</td>
        <td>{trade.executions.length}</td>
        <td>{trade.executions[0].timestamp.toISOTime()}</td>
        <td>{trade.isShort ? 'Short' : 'Long'}</td>
        <td>{trade.closedPl}</td>
      </tr>
    );
  });

  return (
    <div>
      <h1>import</h1>
      <input type="file" ref={fileInputEl} onChange={handleSubmit} />
      <button onClick={handleClear}>Clear file</button>
      <table>
        <thead>
          <tr>
            <td>Symbol</td>
            <td>Executions</td>
            <td>Opened</td>
            <td>Long/Short</td>
            <td>Realized P/L</td>
          </tr>
        </thead>
        <tbody>{tradeList}</tbody>
      </table>
    </div>
  );
};

export default ImportTrades;
