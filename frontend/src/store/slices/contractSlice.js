import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

export const fetchContracts = createAsyncThunk(
  'contracts/fetchContracts',
  async ({ status, companyId }, thunkAPI) => {
    const params = { status, companyId };
    const response = await client.get('/contracts', { params });
    return response.data.data;
  }
);

export const createContract = createAsyncThunk(
  'contracts/createContract',
  async (contractData, thunkAPI) => {
    const response = await client.post('/contracts', contractData);
    return response.data;
  }
);

export const updateContract = createAsyncThunk(
  'contracts/updateContract',
  async ({ id, data }, thunkAPI) => {
    const response = await client.put(`/contracts/${id}`, data);
    return response.data;
  }
);

export const billContract = createAsyncThunk(
  'contracts/billContract',
  async (id, thunkAPI) => {
    const response = await client.post(`/contracts/${id}/bill`);
    return response.data;
  }
);

const contractSlice = createSlice({
  name: 'contracts',
  initialState: {
    contracts: [],
    loading: false,
    error: null,
    selected: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContracts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContracts.fulfilled, (state, action) => {
        state.loading = false;
        state.contracts = action.payload;
      })
      .addCase(fetchContracts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createContract.fulfilled, (state, action) => {
        state.contracts.unshift(action.payload.data);
      })
      .addCase(updateContract.fulfilled, (state, action) => {
        const index = state.contracts.findIndex(c => c._id === action.payload.data._id);
        if (index !== -1) state.contracts[index] = action.payload.data;
      });
  },
});

export const { clearError } = contractSlice.actions;
export default contractSlice.reducer;
