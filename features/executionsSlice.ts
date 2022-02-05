import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../app/store';
import {
  Execution,
  ExecutionJson,
  fromTradeJson,
  toExecutionJson,
  TradeJson,
  TraderperfResponse,
} from '../model';
import TraderPerfApiClient from '../util/apiClient';

export interface ExeuctionsState {
  executions: ExecutionJson[];
  trades: TradeJson[];
}

const initialState: ExeuctionsState = {
  executions: [],
  trades: [],
};

export const getExecutionsAsync = createAsyncThunk(
  'executions/fetch',
  async () => {
    const executions = await new TraderPerfApiClient().getExecutions();
    // Handle error
    return executions.data as TraderperfResponse<TradeJson[]>;
  }
);

export const saveExecutionsAsync = createAsyncThunk(
  'executions/fetch',
  async (executions: Execution[]) => {
    const response = await new TraderPerfApiClient().saveExecutions(
      executions.map(toExecutionJson)
    );
    return response.data as TraderperfResponse<TradeJson>;
  }
);

export const executionsSlice = createSlice({
  name: 'executions',
  initialState,
  reducers: {
    setExecutions: (state, action: PayloadAction<ExecutionJson[]>) => {
      state.executions = [...action.payload];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getExecutionsAsync.fulfilled,
      (state, action: PayloadAction<TraderperfResponse<TradeJson[]>>) => {
        console.log(action.payload);
        state.trades = [...action.payload.data];
      }
    );
  },
});

export const selectTrades = (state: AppState) =>
  state.exeuctions.trades.map(fromTradeJson);

export const { setExecutions } = executionsSlice.actions;

export default executionsSlice.reducer;
