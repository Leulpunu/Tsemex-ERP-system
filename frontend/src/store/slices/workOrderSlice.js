import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../../api/client'

const extractMessage = (error) =>
  (error.response && error.response.data && error.response.data.message) ||
  error.message ||
  error.toString()

export const getWorkOrders = createAsyncThunk('workOrders/getAll', async ({ companyId } = {}, thunkAPI) => {
  try {
    const response = await api.get('/work-orders', { params: companyId ? { companyId } : undefined })
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

export const createWorkOrder = createAsyncThunk('workOrders/create', async ({ workOrderData, companyId } = {}, thunkAPI) => {
  try {
    const response = await api.post('/work-orders', workOrderData, { params: companyId ? { companyId } : undefined })
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

export const updateWorkOrder = createAsyncThunk('workOrders/update', async ({ id, workOrderData }, thunkAPI) => {
  try {
    const response = await api.put(`/work-orders/${id}`, workOrderData)
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

export const getWorkOrder = createAsyncThunk('workOrders/getOne', async (id, thunkAPI) => {
  try {
    const response = await api.get(`/work-orders/${id}`)
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

const initialState = {
  workOrders: [],
  selectedWorkOrder: null,
  isLoading: false,
  isError: false,
  message: '',
}

const workOrderSlice = createSlice({
  name: 'workOrders',
  initialState,
  reducers: {
    clearSelectedWorkOrder: (state) => {
      state.selectedWorkOrder = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWorkOrders.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getWorkOrders.fulfilled, (state, action) => {
        state.isLoading = false
        state.workOrders = action.payload?.data || []
      })
      .addCase(getWorkOrders.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createWorkOrder.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createWorkOrder.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload?.data) state.workOrders = [action.payload.data, ...state.workOrders]
      })
      .addCase(createWorkOrder.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updateWorkOrder.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateWorkOrder.fulfilled, (state, action) => {
        state.isLoading = false
        const updated = action.payload?.data
        if (updated?._id) state.workOrders = state.workOrders.map((wo) => (wo._id === updated._id ? updated : wo))
      })
      .addCase(updateWorkOrder.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getWorkOrder.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getWorkOrder.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedWorkOrder = action.payload?.data || null
      })
      .addCase(getWorkOrder.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { clearSelectedWorkOrder } = workOrderSlice.actions
export default workOrderSlice.reducer

