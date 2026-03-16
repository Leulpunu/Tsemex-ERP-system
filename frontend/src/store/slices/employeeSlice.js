import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../../api/client'

const extractMessage = (error) =>
  (error.response && error.response.data && error.response.data.message) ||
  error.message ||
  error.toString()

export const getEmployees = createAsyncThunk('employees/getAll', async ({ companyId } = {}, thunkAPI) => {
  try {
    const response = await api.get('/employees', { params: companyId ? { companyId } : undefined })
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

export const getEmployee = createAsyncThunk('employees/getOne', async (id, thunkAPI) => {
  try {
    const response = await api.get(`/employees/${id}`)
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

export const createEmployee = createAsyncThunk('employees/create', async ({ employeeData, companyId } = {}, thunkAPI) => {
  try {
    const response = await api.post('/employees', employeeData, { params: companyId ? { companyId } : undefined })
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

export const updateEmployee = createAsyncThunk('employees/update', async ({ id, employeeData }, thunkAPI) => {
  try {
    const response = await api.put(`/employees/${id}`, employeeData)
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

export const deleteEmployee = createAsyncThunk('employees/delete', async (id, thunkAPI) => {
  try {
    const response = await api.delete(`/employees/${id}`)
    return { id, ...response.data }
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

const initialState = {
  employees: [],
  selectedEmployee: null,
  isLoading: false,
  isError: false,
  message: '',
}

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    clearSelectedEmployee: (state) => {
      state.selectedEmployee = null
    },
    resetEmployeeState: (state) => {
      state.isLoading = false
      state.isError = false
      state.message = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEmployees.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getEmployees.fulfilled, (state, action) => {
        state.isLoading = false
        state.employees = action.payload?.data || []
      })
      .addCase(getEmployees.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getEmployee.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getEmployee.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedEmployee = action.payload?.data || null
      })
      .addCase(getEmployee.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createEmployee.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload?.data) state.employees = [action.payload.data, ...state.employees]
        state.message = 'Employee created successfully'
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updateEmployee.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.isLoading = false
        const updated = action.payload?.data
        if (updated?._id) {
          state.employees = state.employees.map((e) => (e._id === updated._id ? updated : e))
          if (state.selectedEmployee?._id === updated._id) state.selectedEmployee = updated
        }
        state.message = 'Employee updated successfully'
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(deleteEmployee.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.isLoading = false
        const id = action.payload?.id
        if (id) state.employees = state.employees.filter((e) => e._id !== id)
        if (state.selectedEmployee?._id === id) state.selectedEmployee = null
        state.message = 'Employee deleted successfully'
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { clearSelectedEmployee, resetEmployeeState } = employeeSlice.actions
export default employeeSlice.reducer

