import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { clearSelectedWarehouse, createWarehouse, getWarehouse, updateWarehouse } from '../../store/slices/warehouseSlice'

const WarehouseForm = () => {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { selectedWarehouse, isLoading, isError, message } = useSelector((state) => state.warehouses)
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
      city: '',
      country: '',
      capacity: '',
    },
  })

  useEffect(() => {
    if (!isEdit) {
      dispatch(clearSelectedWarehouse())
      reset({ name: '', city: '', country: '', capacity: '' })
      return
    }
    dispatch(getWarehouse(id))
    return () => dispatch(clearSelectedWarehouse())
  }, [dispatch, id, isEdit, reset])

  useEffect(() => {
    if (!isEdit) return
    if (!selectedWarehouse?._id) return
    reset({
      name: selectedWarehouse.name || '',
      city: selectedWarehouse.address?.city || '',
      country: selectedWarehouse.address?.country || '',
      capacity: selectedWarehouse.capacity ?? '',
    })
  }, [isEdit, reset, selectedWarehouse])

  useEffect(() => {
    if (isError && message) toast.error(message)
  }, [isError, message])

  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      address: {
        city: data.city || '',
        country: data.country || '',
      },
      capacity: data.capacity === '' ? undefined : Number(data.capacity),
    }

    try {
      if (isEdit) {
        await dispatch(updateWarehouse({ id, warehouseData: payload })).unwrap()
        toast.success('Warehouse updated')
      } else {
        const companyId = user?.role === 'super_admin' ? currentCompany?._id : undefined
        await dispatch(createWarehouse({ warehouseData: payload, companyId })).unwrap()
        toast.success('Warehouse created')
      }
      navigate('/warehouses')
    } catch {
      // handled by slice message + toast effect
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? 'Edit Warehouse' : 'New Warehouse'}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
          <input
            {...register('name', { required: 'Name is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">City (optional)</label>
            <input
              {...register('city')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Country (optional)</label>
            <input
              {...register('country')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Capacity (optional)</label>
          <input
            type="number"
            step="1"
            {...register('capacity', {
              validate: (v) => (v === '' || Number(v) >= 0 ? true : 'Capacity must be 0 or greater'),
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.capacity && <p className="text-sm text-red-600 mt-1">{errors.capacity.message}</p>}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/warehouses')}
            className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            {isLoading ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Warehouse'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default WarehouseForm

