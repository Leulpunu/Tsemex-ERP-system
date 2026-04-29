import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

export const fetchSummary = createAsyncThunk(
  'reports/fetchSummary',
  async (_, { getState }) => {
    const { auth } = getState();
    const params = auth.user.role === 'super_admin' ? { companyId: auth.user.companyId } : {};
    const response = await api.get('/reports/summary', { params });
    return response.data.data;
  }
);

export const fetchTrialBalance = createAsyncThunk(
  'reports/fetchTrialBalance',
  async ({ from, to, basis }, { getState }) => {
    const { auth } = getState();
    const params = { from, to, basis };
    if (auth.user.role === 'super_admin') params.companyId = auth.user.companyId;
    const response = await api.get('/reports/trial-balance', { params });
    return response.data.data;
  }
);

export const fetchBalanceSheet = createAsyncThunk(
  'reports/fetchBalanceSheet',
  async (asOf, { getState }) => {
    const { auth } = getState();
    const params = { asOf };
    if (auth.user.role === 'super_admin') params.companyId = auth.user.companyId;
    const response = await api.get('/reports/balance-sheet', { params });
    return response.data.data;
  }
);

// Similar thunks for other reports...

const reportSlice = createSlice({
  name: 'reports',
  initialState: {
    summary: null,
    trialBalance: null,
    balanceSheet: null,
    incomeStatement: null,
    arAging: null,
    apAging: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSummary.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add other cases...
      ;
  },
});

export const { clearError } = reportSlice.actions;
export default reportSlice.reducer;
