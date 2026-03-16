import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../../api/client'

const extractMessage = (error) =>
  (error.response && error.response.data && error.response.data.message) ||
  error.message ||
  error.toString()

export const getSuppliers = createAsyncThunk('suppliers/getAll', async ({ companyId } = {}, thunkAPI) => {
  try {
    const response = await api.get('/suppliers', { params: companyId ? { companyId } : undefined })
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

export const createSupplier = createAsyncThunk('suppliers/create', async ({ supplierData, companyId } = {}, thunkAPI) => {
  try {
    const response = await api.post('/suppliers', supplierData, { params: companyId ? { companyId } : undefined })
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

export const updateSupplier = createAsyncThunk('suppliers/update', async ({ id, supplierData }, thunkAPI) => {
  try {
    const response = await api.put(`/suppliers/${id}`, supplierData)
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

export const deleteSupplier = createAsyncThunk('suppliers/delete', async (id, thunkAPI) => {
  try {
    const response = await api.delete(`/suppliers/${id}`)
    return { id, ...response.data }
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

export const getSupplier = createAsyncThunk('suppliers/getOne', async (id, thunkAPI) => {
  try {
    const response = await api.get(`/suppliers/${id}`)
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

const initialState = {
  suppliers: [],
  selectedSupplier: null,
  isLoading: false,
  isError: false,
  message: '',
}

const supplierSlice = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {
    clearSelectedSupplier: (state) => {
      state.selectedSupplier = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSuppliers.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getSuppliers.fulfilled, (state, action) => {
        state.isLoading = false
        state.suppliers = action.payload?.data || []
      })
      .addCase(getSuppliers.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createSupplier.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload?.data) state.suppliers = [...state.suppliers, action.payload.data]
      })
      .addCase(createSupplier.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updateSupplier.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        state.isLoading = false
        const updated = action.payload?.data
        if (updated?._id) state.suppliers = state.suppliers.map((s) => (s._id === updated._id ? updated : s))
      })
      .addCase(updateSupplier.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(deleteSupplier.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.isLoading = false
        const id = action.payload?.id
        if (id) state.suppliers = state.suppliers.filter((s) => s._id !== id)
      })
      .addCase(deleteSupplier.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getSupplier.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getSupplier.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedSupplier = action.payload?.data || null
      })
      .addCase(getSupplier.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { clearSelectedSupplier } = supplierSlice.actions
export default supplierSlice.reducer

