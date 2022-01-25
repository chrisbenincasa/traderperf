import type { NextPage } from 'next';
import { ChangeEvent, useMemo, useRef, useState } from 'react';
import TradesTable from '../../components/tradesTable';
import { Trade } from '../../model';
import IbkrParser from '../../parsers/ibkrParser';
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

  return (
    <div>
      <h1 className="text-3xl font-bold underline">import</h1>
      <p className="mt-3 text-2xl">tset trest test test</p>
      <input type="file" ref={fileInputEl} onChange={handleSubmit} />
      <button onClick={handleClear}>Clear file</button>
      <TradesTable trades={trades} />
    </div>
  );
};

export default ImportTrades;
