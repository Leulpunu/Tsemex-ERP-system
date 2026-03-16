const fs = require('fs');
const content = `import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api/companies/'

export const getCompanies = createAsyncThunk(
  'company/getCompanies',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(API_URL)
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const createCompany = createAsyncThunk(
  'company/createCompany',
  async (companyData, thunkAPI) => {
    try {
      const response = await axios.post(API_URL, companyData)
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message)
    }
  }
)

const initialState = {
  companies: [],
  currentCompany: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
}

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setCurrentCompany: (state, action) => {
      state.currentCompany = action.payload
    },
    reset: (state) => {
      state.isLoading = false
      state.isError = false
      state.isSuccess = false
      state.message = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCompanies.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCompanies.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.companies = action.payload
      })
      .addCase(getCompanies.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload?.message || 'Error fetching companies'
      })
      .addCase(createCompany.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.companies.push(action.payload)
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload?.message || 'Error creating company'
      })
  },
})

export const { setCurrentCompany, reset } = companySlice.actions
export default companySlice.reducer
`;
fs.writeFileSync('e:/Tsemex App/Tsemex-ERP-system/frontend/src/store/slices/companySlice.js', content);
console.log('File written successfully');
