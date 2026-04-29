import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

export const fetchCashAccounts = createAsyncThunk(
  'cash/fetchAccounts',
  async (_, { getState }) => {
    const response = await api.get('/cash');
    return response.data.data;
  }
);

const cashSlice = createSlice({
  name: 'cash',
  initialState: {
    accounts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCashAccounts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCashAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload;
      })
      .addCase(fetchCashAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default cashSlice.reducer;

