import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../../api/client'

const extractMessage = (error) =>
  (error.response && error.response.data && error.response.data.message) ||
  error.message ||
  error.toString()

export const getWarehouses = createAsyncThunk('warehouses/getAll', async ({ companyId } = {}, thunkAPI) => {
  try {
    const response = await api.get('/warehouses', { params: companyId ? { companyId } : undefined })
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

export const createWarehouse = createAsyncThunk(
  'warehouses/create',
  async ({ warehouseData, companyId } = {}, thunkAPI) => {
    try {
      const response = await api.post('/warehouses', warehouseData, { params: companyId ? { companyId } : undefined })
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(extractMessage(error))
    }
  }
)

export const updateWarehouse = createAsyncThunk('warehouses/update', async ({ id, warehouseData }, thunkAPI) => {
  try {
    const response = await api.put(`/warehouses/${id}`, warehouseData)
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

export const deleteWarehouse = createAsyncThunk('warehouses/delete', async (id, thunkAPI) => {
  try {
    const response = await api.delete(`/warehouses/${id}`)
    return { id, ...response.data }
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

export const getWarehouse = createAsyncThunk('warehouses/getOne', async (id, thunkAPI) => {
  try {
    const response = await api.get(`/warehouses/${id}`)
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

const initialState = {
  warehouses: [],
  selectedWarehouse: null,
  isLoading: false,
  isError: false,
  message: '',
}

const warehouseSlice = createSlice({
  name: 'warehouses',
  initialState,
  reducers: {
    clearSelectedWarehouse: (state) => {
      state.selectedWarehouse = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWarehouses.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getWarehouses.fulfilled, (state, action) => {
        state.isLoading = false
        state.warehouses = action.payload?.data || []
      })
      .addCase(getWarehouses.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createWarehouse.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createWarehouse.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload?.data) state.warehouses = [...state.warehouses, action.payload.data]
      })
      .addCase(createWarehouse.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updateWarehouse.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateWarehouse.fulfilled, (state, action) => {
        state.isLoading = false
        const updated = action.payload?.data
        if (updated?._id) state.warehouses = state.warehouses.map((w) => (w._id === updated._id ? updated : w))
      })
      .addCase(updateWarehouse.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(deleteWarehouse.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteWarehouse.fulfilled, (state, action) => {
        state.isLoading = false
        const id = action.payload?.id
        if (id) state.warehouses = state.warehouses.filter((w) => w._id !== id)
      })
      .addCase(deleteWarehouse.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getWarehouse.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getWarehouse.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedWarehouse = action.payload?.data || null
      })
      .addCase(getWarehouse.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { clearSelectedWarehouse } = warehouseSlice.actions
export default warehouseSlice.reducer

