import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../../api/client'

const extractMessage = (error) =>
  (error.response && error.response.data && error.response.data.message) ||
  error.message ||
  error.toString()

export const getTasks = createAsyncThunk('tasks/getAll', async ({ companyId, departmentId } = {}, thunkAPI) => {
  try {
    const params = {}
    if (companyId) params.companyId = companyId
    if (departmentId) params.departmentId = departmentId
    const response = await api.get('/tasks', { params: Object.keys(params).length ? params : undefined })
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

export const createTask = createAsyncThunk('tasks/create', async ({ taskData, companyId } = {}, thunkAPI) => {
  try {
    const response = await api.post('/tasks', taskData, { params: companyId ? { companyId } : undefined })
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

export const updateTask = createAsyncThunk('tasks/update', async ({ id, taskData }, thunkAPI) => {
  try {
    const response = await api.put(`/tasks/${id}`, taskData)
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    isLoading: false,
    isError: false,
    message: '',
  },
  reducers: {
    resetTaskState: (state) => {
      state.isLoading = false
      state.isError = false
      state.message = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.isLoading = false
        state.tasks = action.payload?.data || []
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createTask.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload?.data) state.tasks = [action.payload.data, ...state.tasks]
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false
        const updated = action.payload?.data
        if (updated?._id) {
          state.tasks = state.tasks.map((task) => (task._id === updated._id ? updated : task))
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { resetTaskState } = taskSlice.actions
export default taskSlice.reducer
