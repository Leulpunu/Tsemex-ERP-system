import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_BASE = 'http://localhost:5000/api'

// Get Companies
export const getCompanies = createAsyncThunk(
  'company/getCompanies', 
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token
      const response = await axios.get(`${API_BASE}/companies`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) 
        || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Create Company
export const createCompany = createAsyncThunk(
  'company/createCompany',
  async (companyData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token
      const response = await axios.post(`${API_BASE}/companies`, companyData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) 
        || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

const initialState = {
  companies: [],
  currentCompany: null,
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
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCompanies.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCompanies.fulfilled, (state, action) => {
        state.isLoading = false
        state.companies = action.payload
      })
      .addCase(getCompanies.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createCompany.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.isLoading = false
        state.companies.push(action.payload)
        state.message = 'Company created successfully'
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  }
})

export const { reset, setCurrentCompany } = companySlice.actions
export default companySlice.reducer

