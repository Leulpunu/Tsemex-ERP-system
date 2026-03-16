import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../../api/client'

const extractMessage = (error) =>
  (error.response && error.response.data && error.response.data.message) ||
  error.message ||
  error.toString()

export const getProperties = createAsyncThunk('properties/getAll', async ({ companyId } = {}, thunkAPI) => {
  try {
    const response = await api.get('/properties', { params: companyId ? { companyId } : undefined })
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

export const createProperty = createAsyncThunk('properties/create', async ({ propertyData, companyId } = {}, thunkAPI) => {
  try {
    const response = await api.post('/properties', propertyData, { params: companyId ? { companyId } : undefined })
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

export const updateProperty = createAsyncThunk('properties/update', async ({ id, propertyData }, thunkAPI) => {
  try {
    const response = await api.put(`/properties/${id}`, propertyData)
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

const initialState = {
  properties: [],
  isLoading: false,
  isError: false,
  message: '',
}

const propertySlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProperties.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getProperties.fulfilled, (state, action) => {
        state.isLoading = false
        state.properties = action.payload?.data || []
      })
      .addCase(getProperties.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createProperty.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload?.data) state.properties = [...state.properties, action.payload.data]
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updateProperty.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateProperty.fulfilled, (state, action) => {
        state.isLoading = false
        const updated = action.payload?.data
        if (updated?._id) state.properties = state.properties.map((p) => (p._id === updated._id ? updated : p))
      })
      .addCase(updateProperty.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export default propertySlice.reducer

