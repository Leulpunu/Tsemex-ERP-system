import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { clearSelectedProduct, createProduct, getProduct, updateProduct } from '../../store/slices/productSlice'

const ProductForm = () => {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { selectedProduct, isLoading, isError, message } = useSelector((state) => state.products)
  const { currentCompany } = useSelector((state) => state.company)
  const { user } = useSelector((state) => state.auth)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      sku: '',
      category: '',
      unit: 'pcs',
      minStock: 0,
      currentStock: 0,
      purchasePrice: 0,
      salePrice: 0,
    },
  })

  useEffect(() => {
    if (!isEdit) {
      dispatch(clearSelectedProduct())
      return
    }
    dispatch(getProduct(id))
    return () => dispatch(clearSelectedProduct())
  }, [dispatch, id, isEdit])

  useEffect(() => {
    if (!isEdit) return
    if (!selectedProduct?._id) return
    reset({
      name: selectedProduct.name || '',
      sku: selectedProduct.sku || '',
      category: selectedProduct.category || '',
      unit: selectedProduct.unit || 'pcs',
      minStock: selectedProduct.minStock ?? 0,
      currentStock: selectedProduct.currentStock ?? 0,
      purchasePrice: selectedProduct.purchasePrice ?? 0,
      salePrice: selectedProduct.salePrice ?? 0,
    })
  }, [isEdit, reset, selectedProduct])

  useEffect(() => {
    if (isError && message) toast.error(message)
  }, [isError, message])

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      sku: String(data.sku || '').trim().toUpperCase(),
      minStock: Number(data.minStock || 0),
      currentStock: Number(data.currentStock || 0),
      purchasePrice: Number(data.purchasePrice || 0),
      salePrice: Number(data.salePrice || 0),
    }

    try {
      if (isEdit) {
        await dispatch(updateProduct({ id, productData: payload })).unwrap()
        toast.success('Product updated')
      } else {
        const companyId = user?.role === 'super_admin' ? currentCompany?._id : undefined
        await dispatch(createProduct({ productData: payload, companyId })).unwrap()
        toast.success('Product created')
      }
      navigate('/products')
    } catch {
      // handled by slice message + toast effect
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? 'Edit Product' : 'New Product'}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm p-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">SKU</label>
            <input
              {...register('sku', { required: 'SKU is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.sku && <p className="text-sm text-red-600 mt-1">{errors.sku.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Category (optional)</label>
            <input
              {...register('category')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Unit</label>
            <select
              {...register('unit')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="pcs">pcs</option>
              <option value="kg">kg</option>
              <option value="liter">liter</option>
              <option value="meter">meter</option>
              <option value="box">box</option>
              <option value="pack">pack</option>
              <option value="set">set</option>
              <option value="other">other</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Min stock</label>
            <input
              type="number"
              step="1"
              {...register('minStock', { min: { value: 0, message: 'Must be 0 or greater' } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.minStock && <p className="text-sm text-red-600 mt-1">{errors.minStock.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Current stock</label>
            <input
              type="number"
              step="1"
              {...register('currentStock', { min: { value: 0, message: 'Must be 0 or greater' } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.currentStock && <p className="text-sm text-red-600 mt-1">{errors.currentStock.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Purchase price</label>
            <input
              type="number"
              step="0.01"
              {...register('purchasePrice', { min: { value: 0, message: 'Must be 0 or greater' } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.purchasePrice && <p className="text-sm text-red-600 mt-1">{errors.purchasePrice.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Sale price</label>
            <input
              type="number"
              step="0.01"
              {...register('salePrice', { min: { value: 0, message: 'Must be 0 or greater' } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.salePrice && <p className="text-sm text-red-600 mt-1">{errors.salePrice.message}</p>}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
          >
            {isLoading ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductForm

