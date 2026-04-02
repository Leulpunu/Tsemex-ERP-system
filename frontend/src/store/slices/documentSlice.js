import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../api/client'

const extractMessage = (error) =>
  (error.response && error.response.data && error.response.data.message) ||
  error.message ||
  error.toString()

// Get Documents
export const getDocuments = createAsyncThunk(
  'documents/getDocuments', 
  async ({ category, search, page = 1, limit = 20 }, thunkAPI) => {
    try {
      const params = new URLSearchParams({ page, limit })
      if (category) params.append('category', category)
      if (search) params.append('search', search)
      
      const response = await api.get(`/documents?${params}`)
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(extractMessage(error))
    }
  }
)

// Upload Document
export const uploadDocument = createAsyncThunk(
  'documents/uploadDocument',
  async (formData, thunkAPI) => {
    try {
      const response = await api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(extractMessage(error))
    }
  }
)

// Delete Document
export const deleteDocument = createAsyncThunk(
  'documents/deleteDocument',
  async (id, thunkAPI) => {
    try {
      const response = await api.delete(`/documents/${id}`)
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(extractMessage(error))
    }
  }
)

const initialState = {
  documents: [],
  isLoading: false,
  isUploading: false,
  isError: false,
  message: '',
  pagination: {}
}

const documentSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    reset: (state) => initialState
  },
  extraReducers: (builder) => {
    builder
      // Get Documents
      .addCase(getDocuments.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getDocuments.fulfilled, (state, action) => {
        state.isLoading = false
        state.documents = action.payload.data || []
        state.pagination = action.payload.pagination || {}
      })
      .addCase(getDocuments.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Upload
      .addCase(uploadDocument.pending, (state) => {
        state.isUploading = true
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.isUploading = false
        state.documents.unshift(action.payload.data)
        state.message = 'Document uploaded successfully'
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.isUploading = false
        state.isError = true
        state.message = action.payload
      })
      // Delete
      .addCase(deleteDocument.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.isLoading = false
        state.documents = state.documents.filter(doc => doc._id !== action.meta.arg)
        state.message = 'Document deleted'
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  }
})

export const { reset } = documentSlice.actions
export default documentSlice.reducer

