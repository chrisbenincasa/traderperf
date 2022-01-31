import type { NextPage } from 'next';
import { ChangeEvent, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import TradesTable from '../../components/tradesTable';
import { saveExecutionsAsync } from '../../features/executionsSlice';
import {
  allPlatforms,
  Platform,
  platformToPrettyString,
  Trade,
} from '../../model';
import ParserFactory from '../../parsers/parserFactory';
import TradeMatcher from '../../util/tradeMatcher';

const ImportTrades: NextPage = () => {
  const fileInputEl = useRef<HTMLInputElement | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [broker, setBroker] = useState<Platform>(allPlatforms[0]);
  const dispatch = useDispatch();

  const handleSubmit = async function (event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      const file = event.target.files[0];
      const parser = ParserFactory.getParser(broker);
      if (parser) {
        const data = await file.text();
        const result = parser.parse(data);
        const matched = new TradeMatcher().match(result.executions);
        dispatch(saveExecutionsAsync(result.executions));
        setTrades(matched);
      }
    }
  };

  const handleClear = function () {
    if (fileInputEl.current) {
      fileInputEl.current.value = '';
    }
  };

  const platforms = allPlatforms.map((platform) => (
    <option key={platform} value={platform}>
      {platformToPrettyString(platform)}
    </option>
  ));

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold underline">import</h1>
      <select
        value={broker}
        onChange={(v) => setBroker(v.target.value as Platform)}
      >
        {platforms}
      </select>
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
