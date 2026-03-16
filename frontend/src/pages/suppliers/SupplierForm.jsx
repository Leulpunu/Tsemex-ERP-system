import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { clearSelectedSupplier, createSupplier, getSupplier, updateSupplier } from '../../store/slices/supplierSlice'

const SupplierForm = () => {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { selectedSupplier, isLoading, isError, message } = useSelector((state) => state.suppliers)
  const { currentCompany } = useSelector((state) => state.company)
  const { user } = useSelector((state) => state.auth)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { name: '', email: '', phone: '' },
  })

  useEffect(() => {
    if (!isEdit) {
      dispatch(clearSelectedSupplier())
      reset({ name: '', email: '', phone: '' })
      return
    }
    dispatch(getSupplier(id))
    return () => dispatch(clearSelectedSupplier())
  }, [dispatch, id, isEdit, reset])

  useEffect(() => {
    if (!isEdit) return
    if (!selectedSupplier?._id) return
    reset({
      name: selectedSupplier.name || '',
      email: selectedSupplier.email || '',
      phone: selectedSupplier.phone || '',
    })
  }, [isEdit, reset, selectedSupplier])

  useEffect(() => {
    if (isError && message) toast.error(message)
  }, [isError, message])

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await dispatch(updateSupplier({ id, supplierData: data })).unwrap()
        toast.success('Supplier updated')
      } else {
        const companyId = user?.role === 'super_admin' ? currentCompany?._id : undefined
        await dispatch(createSupplier({ supplierData: data, companyId })).unwrap()
        toast.success('Supplier created')
      }
      navigate('/suppliers')
    } catch {
      // handled by slice message + toast effect
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? 'Edit Supplier' : 'New Supplier'}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
          <input
            {...register('name', { required: 'Name is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email (optional)</label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Phone (optional)</label>
          <input
            {...register('phone')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/suppliers')}
            className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            {isLoading ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Supplier'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SupplierForm

