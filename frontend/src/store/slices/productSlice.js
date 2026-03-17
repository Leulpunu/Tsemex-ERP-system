import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../../api/client'

const extractMessage = (error) =>
  (error.response && error.response.data && error.response.data.message) ||
  error.message ||
  error.toString()

export const getProducts = createAsyncThunk('products/getAll', async ({ companyId } = {}, thunkAPI) => {
  try {
    const response = await api.get('/products', { params: companyId ? { companyId } : undefined })
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

export const createProduct = createAsyncThunk('products/create', async ({ productData, companyId } = {}, thunkAPI) => {
  try {
    const response = await api.post('/products', productData, { params: companyId ? { companyId } : undefined })
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

export const updateProduct = createAsyncThunk('products/update', async ({ id, productData }, thunkAPI) => {
  try {
    const response = await api.put(`/products/${id}`, productData)
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

export const deleteProduct = createAsyncThunk('products/delete', async (id, thunkAPI) => {
  try {
    const response = await api.delete(`/products/${id}`)
    return { id, ...response.data }
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

export const getProduct = createAsyncThunk('products/getOne', async (id, thunkAPI) => {
  try {
    const response = await api.get(`/products/${id}`)
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(extractMessage(error))
  }
})

const initialState = {
  products: [],
  selectedProduct: null,
  isLoading: false,
  isError: false,
  message: '',
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.products = action.payload?.data || []
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload?.data) state.products = [...state.products, action.payload.data]
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false
        const updated = action.payload?.data
        if (updated?._id) state.products = state.products.map((p) => (p._id === updated._id ? updated : p))
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false
        const id = action.payload?.id
        if (id) state.products = state.products.filter((p) => p._id !== id)
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getProduct.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedProduct = action.payload?.data || null
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { clearSelectedProduct } = productSlice.actions
export default productSlice.reducer

