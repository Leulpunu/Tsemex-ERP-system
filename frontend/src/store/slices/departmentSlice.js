import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../../api/client'

const extractMessage = (error) =>
  (error.response && error.response.data && error.response.data.message) ||
  error.message ||
  error.toString()

export const getDepartments = createAsyncThunk('departments/getAll', async ({ companyId } = {}, thunkAPI) => {
  try {
    const response = await api.get('/departments', { params: companyId ? { companyId } : undefined })
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

export const createDepartment = createAsyncThunk(
  'departments/create',
  async ({ departmentData, companyId } = {}, thunkAPI) => {
    try {
      const response = await api.post('/departments', departmentData, { params: companyId ? { companyId } : undefined })
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(extractMessage(error))
    }
  }
)

export const updateDepartment = createAsyncThunk('departments/update', async ({ id, departmentData }, thunkAPI) => {
  try {
    const response = await api.put(`/departments/${id}`, departmentData)
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

export const deleteDepartment = createAsyncThunk('departments/delete', async (id, thunkAPI) => {
  try {
    const response = await api.delete(`/departments/${id}`)
    return { id, ...response.data }
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

export const getDepartment = createAsyncThunk('departments/getOne', async (id, thunkAPI) => {
  try {
    const response = await api.get(`/departments/${id}`)
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

const initialState = {
  departments: [],
  selectedDepartment: null,
  isLoading: false,
  isError: false,
  message: '',
}

const departmentSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    resetDepartmentState: (state) => {
      state.isLoading = false
      state.isError = false
      state.message = ''
    },
    clearSelectedDepartment: (state) => {
      state.selectedDepartment = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDepartments.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getDepartments.fulfilled, (state, action) => {
        state.isLoading = false
        state.departments = action.payload?.data || []
      })
      .addCase(getDepartments.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createDepartment.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload?.data) state.departments = [...state.departments, action.payload.data]
        state.message = 'Department created successfully'
      })
      .addCase(createDepartment.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updateDepartment.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.isLoading = false
        const updated = action.payload?.data
        if (updated?._id) {
          state.departments = state.departments.map((d) => (d._id === updated._id ? updated : d))
        }
        state.message = 'Department updated successfully'
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(deleteDepartment.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.isLoading = false
        const id = action.payload?.id
        if (id) state.departments = state.departments.filter((d) => d._id !== id)
        state.message = 'Department deleted successfully'
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getDepartment.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getDepartment.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedDepartment = action.payload?.data || null
      })
      .addCase(getDepartment.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { resetDepartmentState, clearSelectedDepartment } = departmentSlice.actions
export default departmentSlice.reducer

