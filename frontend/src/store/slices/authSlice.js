import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../api/client'

const normalizeAuthResponse = (payload) => {


  if (!payload) return null
  if (payload.token && payload.data) return { ...payload.data, token: payload.token }
  return payload
}

const initialState = {
  user: null, // start clean

  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
}

export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const response = await api.post('/auth/register', userData)
      if (response.data) {
        const normalized = normalizeAuthResponse(response.data)
        localStorage.setItem('user', JSON.stringify(normalized))
      }
      return normalizeAuthResponse(response.data)
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      const response = await api.post('/auth/login', userData)
      if (response.data) {
        const normalized = normalizeAuthResponse(response.data)
        localStorage.setItem('user', JSON.stringify(normalized))
      }
      return normalizeAuthResponse(response.data)
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('user')
})

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isError = false
      state.isSuccess = false
      state.message = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
      })
  },
})

export const { reset } = authSlice.actions
export default authSlice.reducer
