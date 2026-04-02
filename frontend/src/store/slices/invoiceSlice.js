import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../../api/client'

const extractMessage = (error) =>
  (error.response && error.response.data && error.response.data.message) ||
  error.message ||
  error.toString()

export const getInvoices = createAsyncThunk('invoices/getAll', async ({ companyId } = {}, thunkAPI) => {
  try {
    const response = await api.get('/invoices', { params: companyId ? { companyId } : undefined })
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

export const createInvoice = createAsyncThunk('invoices/create', async ({ invoiceData, companyId } = {}, thunkAPI) => {
  try {
    const response = await api.post('/invoices', invoiceData, { params: companyId ? { companyId } : undefined })
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

export const deleteInvoice = createAsyncThunk('invoices/delete', async (id, thunkAPI) => {
  try {
    const response = await api.delete(`/invoices/${id}`)
    return { id, ...response.data }
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

export const getInvoice = createAsyncThunk('invoices/getOne', async (id, thunkAPI) => {
  try {
    const response = await api.get(`/invoices/${id}`)
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

export const updateInvoice = createAsyncThunk('invoices/update', async ({ id, invoiceData }, thunkAPI) => {
  try {
    const response = await api.put(`/invoices/${id}`, invoiceData)
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

const initialState = {
  invoices: [],
  selectedInvoice: null,
  isLoading: false,
  isError: false,
  message: '',
}

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    clearSelectedInvoice: (state) => {
      state.selectedInvoice = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getInvoices.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getInvoices.fulfilled, (state, action) => {
        state.isLoading = false
        state.invoices = action.payload?.data || []
      })
      .addCase(getInvoices.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createInvoice.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload?.data) state.invoices = [action.payload.data, ...state.invoices]
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(deleteInvoice.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.isLoading = false
        const id = action.payload?.id
        if (id) state.invoices = state.invoices.filter((inv) => inv._id !== id)
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getInvoice.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getInvoice.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedInvoice = action.payload?.data || null
      })
      .addCase(getInvoice.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updateInvoice.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.isLoading = false
        const updated = action.payload?.data
        if (updated?._id) {
          state.invoices = state.invoices.map((inv) => (inv._id === updated._id ? updated : inv))
          state.selectedInvoice = updated
        }
      })
      .addCase(updateInvoice.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { clearSelectedInvoice } = invoiceSlice.actions
export default invoiceSlice.reducer

