import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../../api/client'

const extractMessage = (error) =>
  (error.response && error.response.data && error.response.data.message) ||
  error.message ||
  error.toString()

export const getShipments = createAsyncThunk('shipments/getAll', async ({ companyId } = {}, thunkAPI) => {
  try {
    const response = await api.get('/shipments', { params: companyId ? { companyId } : undefined })
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

export const createShipment = createAsyncThunk('shipments/create', async ({ shipmentData, companyId } = {}, thunkAPI) => {
  try {
    const response = await api.post('/shipments', shipmentData, { params: companyId ? { companyId } : undefined })
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

export const updateShipment = createAsyncThunk('shipments/update', async ({ id, shipmentData }, thunkAPI) => {
  try {
    const response = await api.put(`/shipments/${id}`, shipmentData)
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

const initialState = {
  shipments: [],
  isLoading: false,
  isError: false,
  message: '',
}

const shipmentSlice = createSlice({
  name: 'shipments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getShipments.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getShipments.fulfilled, (state, action) => {
        state.isLoading = false
        state.shipments = action.payload?.data || []
      })
      .addCase(getShipments.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createShipment.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createShipment.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload?.data) state.shipments = [action.payload.data, ...state.shipments]
      })
      .addCase(createShipment.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updateShipment.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateShipment.fulfilled, (state, action) => {
        state.isLoading = false
        const updated = action.payload?.data
        if (updated?._id) state.shipments = state.shipments.map((s) => (s._id === updated._id ? updated : s))
      })
      .addCase(updateShipment.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export default shipmentSlice.reducer

