import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../../api/client'

const extractMessage = (error) =>
  (error.response && error.response.data && error.response.data.message) ||
  error.message ||
  error.toString()

export const getProjects = createAsyncThunk('projects/getAll', async ({ companyId } = {}, thunkAPI) => {
  try {
    const response = await api.get('/projects', { params: companyId ? { companyId } : undefined })
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

export const createProject = createAsyncThunk('projects/create', async ({ projectData, companyId } = {}, thunkAPI) => {
  try {
    const response = await api.post('/projects', projectData, { params: companyId ? { companyId } : undefined })
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

export const updateProject = createAsyncThunk('projects/update', async ({ id, projectData }, thunkAPI) => {
  try {
    const response = await api.put(`/projects/${id}`, projectData)
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

export const deleteProject = createAsyncThunk('projects/delete', async (id, thunkAPI) => {
  try {
    const response = await api.delete(`/projects/${id}`)
    return { id, ...response.data }
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

export const getProject = createAsyncThunk('projects/getOne', async (id, thunkAPI) => {
  try {
    const response = await api.get(`/projects/${id}`)
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

const initialState = {
  projects: [],
  selectedProject: null,
  isLoading: false,
  isError: false,
  message: '',
}

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearSelectedProject: (state) => {
      state.selectedProject = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProjects.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.isLoading = false
        state.projects = action.payload?.data || []
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createProject.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload?.data) state.projects = [action.payload.data, ...state.projects]
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updateProject.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.isLoading = false
        const updated = action.payload?.data
        if (updated?._id) state.projects = state.projects.map((p) => (p._id === updated._id ? updated : p))
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(deleteProject.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isLoading = false
        const id = action.payload?.id
        if (id) state.projects = state.projects.filter((p) => p._id !== id)
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getProject.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getProject.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedProject = action.payload?.data || null
      })
      .addCase(getProject.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { clearSelectedProject } = projectSlice.actions
export default projectSlice.reducer

