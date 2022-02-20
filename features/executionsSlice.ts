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
import { ImportTradesResponse } from '../model/api';
import TraderPerfApiClient from '../util/apiClient';

export interface ExeuctionsState {
  executions: ExecutionJson[];
  trades: TradeJson[];
  tradeDetail?: TradeJson;
  loading: {
    tradeDetail: boolean;
  };
}

const initialState: ExeuctionsState = {
  executions: [],
  trades: [],
  loading: {
    tradeDetail: false,
  },
};

export const getExecutionsAsync = createAsyncThunk(
  'executions/fetch',
  async () => {
    const executions = await new TraderPerfApiClient().getExecutions();
    // Handle error
    return executions.data as TraderperfResponse<ImportTradesResponse>;
  }
);

export type GetTradePayload = {
  id: number;
};
export const getTradeAsync = createAsyncThunk(
  'trades/fetch',
  async (payload: GetTradePayload) => {
    const trade = await new TraderPerfApiClient().getTrade(payload.id);
    return trade.data as TraderperfResponse<TradeJson>;
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
    builder.addCase(getExecutionsAsync.fulfilled, (state, action) => {
      state.trades = [...action.payload.data!.imported];
    });

    builder.addCase(getTradeAsync.pending, (state) => {
      state.loading.tradeDetail = true;
    });

    builder.addCase(
      getTradeAsync.fulfilled,
      (state, action: PayloadAction<TraderperfResponse<TradeJson>>) => {
        state.tradeDetail = action.payload.data;
        state.loading.tradeDetail = false;
      }
    );
  },
});

export const selectTrades = (state: AppState) =>
  state.exeuctions.trades.map(fromTradeJson);

export const selectTradeDetailLoading = (state: AppState) =>
  state.exeuctions.loading.tradeDetail;

export const selectTradeDetail = (state: AppState) =>
  state.exeuctions.tradeDetail;

export const { setExecutions } = executionsSlice.actions;

export default executionsSlice.reducer;
