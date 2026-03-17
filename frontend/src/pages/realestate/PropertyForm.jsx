import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { clearSelectedProperty, createProperty, getProperty, updateProperty } from '../../store/slices/propertySlice'

const PropertyForm = () => {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { selectedProperty, isLoading, isError, message } = useSelector((state) => state.properties)
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
      type: 'residential',
      status: 'available',
      city: '',
      country: '',
      rentPrice: 0,
      salePrice: 0,
      description: '',
    },
  })

  useEffect(() => {
    if (!isEdit) {
      dispatch(clearSelectedProperty())
      return
    }
    dispatch(getProperty(id))
    return () => dispatch(clearSelectedProperty())
  }, [dispatch, id, isEdit])

  useEffect(() => {
    if (!isEdit) return
    if (!selectedProperty?._id) return
    reset({
      name: selectedProperty.name || '',
      type: selectedProperty.type || 'residential',
      status: selectedProperty.status || 'available',
      city: selectedProperty.address?.city || '',
      country: selectedProperty.address?.country || '',
      rentPrice: selectedProperty.rentPrice ?? 0,
      salePrice: selectedProperty.salePrice ?? 0,
      description: selectedProperty.description || '',
    })
  }, [isEdit, reset, selectedProperty])

  useEffect(() => {
    if (isError && message) toast.error(message)
  }, [isError, message])

  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      type: data.type,
      status: data.status,
      address: { city: data.city || '', country: data.country || '' },
      rentPrice: Number(data.rentPrice || 0),
      salePrice: Number(data.salePrice || 0),
      description: data.description || '',
    }

    try {
      if (isEdit) {
        await dispatch(updateProperty({ id, propertyData: payload })).unwrap()
        toast.success('Property updated')
      } else {
        const companyId = user?.role === 'super_admin' ? currentCompany?._id : undefined
        await dispatch(createProperty({ propertyData: payload, companyId })).unwrap()
        toast.success('Property created')
      }
      navigate('/properties')
    } catch {
      // handled by slice message + toast effect
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? 'Edit Property' : 'New Property'}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm p-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Type</label>
            <select
              {...register('type', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="residential">residential</option>
              <option value="commercial">commercial</option>
              <option value="industrial">industrial</option>
              <option value="land">land</option>
              <option value="hotel">hotel</option>
              <option value="mixed_use">mixed_use</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
            <select
              {...register('status', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="available">available</option>
              <option value="occupied">occupied</option>
              <option value="maintenance">maintenance</option>
              <option value="unavailable">unavailable</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">City (optional)</label>
            <input
              {...register('city')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Country (optional)</label>
            <input
              {...register('country')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Rent price</label>
            <input
              type="number"
              step="0.01"
              {...register('rentPrice', { min: { value: 0, message: 'Must be 0 or greater' } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {errors.rentPrice && <p className="text-sm text-red-600 mt-1">{errors.rentPrice.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Sale price</label>
            <input
              type="number"
              step="0.01"
              {...register('salePrice', { min: { value: 0, message: 'Must be 0 or greater' } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {errors.salePrice && <p className="text-sm text-red-600 mt-1">{errors.salePrice.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">Description (optional)</label>
            <textarea
              rows={4}
              {...register('description')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={() => navigate('/properties')}
            className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold"
          >
            {isLoading ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Property'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PropertyForm

