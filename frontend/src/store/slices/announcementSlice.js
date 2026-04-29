import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../../api/client'

const extractMessage = (error) =>
  (error.response && error.response.data && error.response.data.message) ||
  error.message ||
  error.toString()

export const getAnnouncements = createAsyncThunk('announcements/getAll', async ({ companyId, departmentId, type } = {}, thunkAPI) => {
  try {
    const params = {}
    if (companyId) params.companyId = companyId
    if (departmentId) params.departmentId = departmentId
    if (type) params.type = type
    const response = await api.get('/announcements', { params: Object.keys(params).length ? params : undefined })
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

export const createAnnouncement = createAsyncThunk('announcements/create', async ({ announcementData, companyId } = {}, thunkAPI) => {
  try {
    const response = await api.post('/announcements', announcementData, { params: companyId ? { companyId } : undefined })
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

const announcementSlice = createSlice({
  name: 'announcements',
  initialState: {
    announcements: [],
    isLoading: false,
    isError: false,
    message: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAnnouncements.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getAnnouncements.fulfilled, (state, action) => {
        state.isLoading = false
        state.announcements = action.payload?.data || []
      })
      .addCase(getAnnouncements.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createAnnouncement.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createAnnouncement.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload?.data) state.announcements = [action.payload.data, ...state.announcements]
      })
      .addCase(createAnnouncement.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export default announcementSlice.reducer
