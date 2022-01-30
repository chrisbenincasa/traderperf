import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Execution, ExecutionJson, toExecutionJson } from '../model';
import TraderPerfApiClient from '../util/apiClient';

export interface ExeuctionsState {
  executions: ExecutionJson[];
}

const initialState: ExeuctionsState = {
  executions: [],
};

export const getExecutionsAsync = createAsyncThunk(
  'executions/fetch',
  async () => {
    const executions = await new TraderPerfApiClient().getExecutions();
    return executions.data as object;
  }
);

export const saveExxecutionsAsync = createAsyncThunk(
  'executions/fetch',
  async (executions: Execution[]) => {
    const response = await new TraderPerfApiClient().saveExecutions(
      executions.map(toExecutionJson)
    );
    return response.data as object;
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
});

export const { setExecutions } = executionsSlice.actions;

export default executionsSlice.reducer;
