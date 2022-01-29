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
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold underline">import</h1>
      <input
        type="file"
        className="block w-full text-sm text-slate-500
      file:mr-4 file:rounded-full file:border-0
      file:bg-violet-50 file:py-2
      file:px-4 file:text-sm
      file:font-semibold file:text-violet-700
      hover:file:bg-violet-100"
        ref={fileInputEl}
        onChange={handleSubmit}
      />
      <button onClick={handleClear}>Clear file</button>
      <TradesTable trades={trades} />
    </div>
  );
};

export default ImportTrades;
