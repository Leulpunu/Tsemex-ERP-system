import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../api/client'

const extractMessage = (error) =>
  (error.response && error.response.data && error.response.data.message) ||
  error.message ||
  error.toString()

// Get Companies
export const getCompanies = createAsyncThunk(
  'company/getCompanies', 
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/companies/public')
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(extractMessage(error))
    }
  }
)

// Get Company by id
export const getCompany = createAsyncThunk(
  'company/getCompany',
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/companies/${id}`)
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(extractMessage(error))
    }
  }
)

// Create Company
export const createCompany = createAsyncThunk(
  'company/createCompany',
  async (companyData, thunkAPI) => {
    try {
      const response = await api.post('/companies', companyData)
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(extractMessage(error))
    }
  }
)

// Update Company
export const updateCompany = createAsyncThunk(
  'company/updateCompany',
  async ({ id, companyData }, thunkAPI) => {
    try {
      const response = await api.put(`/companies/${id}`, companyData)
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(extractMessage(error))
    }
  }
)

// Delete Company
export const deleteCompany = createAsyncThunk(
  'company/deleteCompany',
  async (id, thunkAPI) => {
    try {
      const response = await api.delete(`/companies/${id}`)
      return { id, ...response.data }
    } catch (error) {
      return thunkAPI.rejectWithValue(extractMessage(error))
    }
  }
)

const initialState = {
  companies: [],
  currentCompany: null,
  selectedCompany: null,
  isLoading: false,
  isError: false,
  message: ''
}

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isError = false
      state.message = ''
    },
    setCurrentCompany: (state, action) => {
      state.currentCompany = action.payload
    },
    clearSelectedCompany: (state) => {
      state.selectedCompany = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCompanies.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCompanies.fulfilled, (state, action) => {
        state.isLoading = false
        state.companies = action.payload?.data || []
        if (!state.currentCompany && state.companies.length > 0) {
          state.currentCompany = state.companies[0]
        }
      })
      .addCase(getCompanies.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getCompany.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCompany.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedCompany = action.payload?.data || null
      })
      .addCase(getCompany.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createCompany.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload?.data) state.companies.push(action.payload.data)
        state.message = 'Company created successfully'
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updateCompany.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.isLoading = false
        const updated = action.payload?.data
        if (updated?._id) {
          state.companies = state.companies.map((c) => (c._id === updated._id ? updated : c))
          if (state.currentCompany?._id === updated._id) state.currentCompany = updated
          if (state.selectedCompany?._id === updated._id) state.selectedCompany = updated
        }
        state.message = 'Company updated successfully'
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(deleteCompany.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.isLoading = false
        const id = action.payload?.id
        if (id) state.companies = state.companies.filter((c) => c._id !== id)
        if (state.currentCompany?._id === id) state.currentCompany = state.companies[0] || null
        if (state.selectedCompany?._id === id) state.selectedCompany = null
        state.message = 'Company deleted successfully'
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  }
})

export const { reset, setCurrentCompany, clearSelectedCompany } = companySlice.actions
export default companySlice.reducer

