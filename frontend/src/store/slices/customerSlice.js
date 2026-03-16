import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../../api/client'

const extractMessage = (error) =>
  (error.response && error.response.data && error.response.data.message) ||
  error.message ||
  error.toString()

export const getCustomers = createAsyncThunk('customers/getAll', async ({ companyId } = {}, thunkAPI) => {
  try {
    const response = await api.get('/customers', { params: companyId ? { companyId } : undefined })
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

export const createCustomer = createAsyncThunk('customers/create', async ({ customerData, companyId } = {}, thunkAPI) => {
  try {
    const response = await api.post('/customers', customerData, { params: companyId ? { companyId } : undefined })
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

export const updateCustomer = createAsyncThunk('customers/update', async ({ id, customerData }, thunkAPI) => {
  try {
    const response = await api.put(`/customers/${id}`, customerData)
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

export const getCustomer = createAsyncThunk('customers/getOne', async (id, thunkAPI) => {
  try {
    const response = await api.get(`/customers/${id}`)
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

const initialState = {
  customers: [],
  selectedCustomer: null,
  isLoading: false,
  isError: false,
  message: '',
}

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    clearSelectedCustomer: (state) => {
      state.selectedCustomer = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCustomers.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCustomers.fulfilled, (state, action) => {
        state.isLoading = false
        state.customers = action.payload?.data || []
      })
      .addCase(getCustomers.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createCustomer.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload?.data) state.customers = [...state.customers, action.payload.data]
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updateCustomer.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.isLoading = false
        const updated = action.payload?.data
        if (updated?._id) state.customers = state.customers.map((c) => (c._id === updated._id ? updated : c))
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getCustomer.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCustomer.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedCustomer = action.payload?.data || null
      })
      .addCase(getCustomer.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { clearSelectedCustomer } = customerSlice.actions
export default customerSlice.reducer

