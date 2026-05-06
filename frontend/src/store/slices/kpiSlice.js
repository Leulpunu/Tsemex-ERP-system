import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../api/client'

const extractMessage = (error) =>
  (error.response && error.response.data && error.response.data.message) ||
  error.message ||
  error.toString()

// Get KPIs
export const getKpis = createAsyncThunk(
  'kpi/getKpis', 
  async (params = {}, thunkAPI) => {
    try {
      const queryString = Object.keys(params).length > 0 ? `?${new URLSearchParams(params).toString()}` : '';
      const response = await api.get(`/kpis${queryString}`)
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(extractMessage(error))
    }
  }
)

// Get KPI by id
export const getKpi = createAsyncThunk(
  'kpi/getKpi',
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/kpis/${id}`)
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(extractMessage(error))
    }
  }
)

// Create KPI
export const createKpi = createAsyncThunk(
  'kpi/createKpi',
  async (kpiData, thunkAPI) => {
    try {
      const response = await api.post('/kpis', kpiData)
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(extractMessage(error))
    }
  }
)

// Update KPI
export const updateKpi = createAsyncThunk(
  'kpi/updateKpi',
  async ({ id, kpiData }, thunkAPI) => {
    try {
      const response = await api.put(`/kpis/${id}`, kpiData)
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(extractMessage(error))
    }
  }
)

const initialState = {
  kpis: [],
  selectedKpi: null,
  isLoading: false,
  isError: false,
  message: ''
}

const kpiSlice = createSlice({
  name: 'kpi',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isError = false
      state.message = ''
    },
    clearSelectedKpi: (state) => {
      state.selectedKpi = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getKpis.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getKpis.fulfilled, (state, action) => {
        state.isLoading = false
        state.kpis = action.payload?.data || []
      })
      .addCase(getKpis.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getKpi.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getKpi.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedKpi = action.payload?.data || null
      })
      .addCase(getKpi.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createKpi.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createKpi.fulfilled, (state, action) => {
        state.isLoading = false
        state.kpis.push(action.payload?.data)
        state.message = 'KPI created successfully'
      })
      .addCase(createKpi.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updateKpi.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateKpi.fulfilled, (state, action) => {
        state.isLoading = false
        const updated = action.payload?.data
        state.kpis = state.kpis.map((kpi) => kpi._id === updated._id ? updated : kpi)
        if (state.selectedKpi?._id === updated._id) {
          state.selectedKpi = updated
        }
        state.message = 'KPI updated successfully'
      })
      .addCase(updateKpi.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  }
})

export const { reset, clearSelectedKpi } = kpiSlice.actions
export default kpiSlice.reducer

