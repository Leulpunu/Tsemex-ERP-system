import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { clearSelectedWorkOrder, createWorkOrder, getWorkOrder, updateWorkOrder } from '../../store/slices/workOrderSlice'

const WorkOrderForm = () => {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { selectedWorkOrder, isLoading, isError, message } = useSelector((state) => state.workOrders)
  const { currentCompany } = useSelector((state) => state.company)
  const { user } = useSelector((state) => state.auth)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      type: 'maintenance',
      priority: 'medium',
      status: 'pending',
      description: '',
      scheduledDate: '',
    },
  })

  useEffect(() => {
    if (!isEdit) {
      dispatch(clearSelectedWorkOrder())
      return
    }
    dispatch(getWorkOrder(id))
    return () => dispatch(clearSelectedWorkOrder())
  }, [dispatch, id, isEdit])

  useEffect(() => {
    if (!isEdit) return
    if (!selectedWorkOrder?._id) return
    reset({
      title: selectedWorkOrder.title || '',
      type: selectedWorkOrder.type || 'maintenance',
      priority: selectedWorkOrder.priority || 'medium',
      status: selectedWorkOrder.status || 'pending',
      description: selectedWorkOrder.description || '',
      scheduledDate: selectedWorkOrder.scheduledDate ? String(selectedWorkOrder.scheduledDate).slice(0, 10) : '',
    })
  }, [isEdit, reset, selectedWorkOrder])

  useEffect(() => {
    if (isError && message) toast.error(message)
  }, [isError, message])

  const onSubmit = async (data) => {
    const payload = {
      title: data.title,
      type: data.type,
      priority: data.priority,
      status: data.status,
      description: data.description || '',
      scheduledDate: data.scheduledDate ? new Date(data.scheduledDate).toISOString() : undefined,
    }

    try {
      if (isEdit) {
        await dispatch(updateWorkOrder({ id, workOrderData: payload })).unwrap()
        toast.success('Work order updated')
      } else {
        const companyId = user?.role === 'super_admin' ? currentCompany?._id : undefined
        await dispatch(createWorkOrder({ workOrderData: payload, companyId })).unwrap()
        toast.success('Work order created')
      }
      navigate('/work-orders')
    } catch {
      // handled by slice message + toast effect
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? 'Edit Work Order' : 'New Work Order'}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm p-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
            <input
              {...register('title', { required: 'Title is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Type</label>
            <select
              {...register('type', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="installation">installation</option>
              <option value="repair">repair</option>
              <option value="maintenance">maintenance</option>
              <option value="inspection">inspection</option>
              <option value="emergency">emergency</option>
              <option value="other">other</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Priority</label>
            <select
              {...register('priority', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
              <option value="urgent">urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
            <select
              {...register('status', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="pending">pending</option>
              <option value="assigned">assigned</option>
              <option value="in_progress">in_progress</option>
              <option value="on_hold">on_hold</option>
              <option value="completed">completed</option>
              <option value="cancelled">cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Scheduled date (optional)</label>
            <input
              type="date"
              {...register('scheduledDate')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">Description (optional)</label>
            <textarea
              rows={4}
              {...register('description')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={() => navigate('/work-orders')}
            className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold"
          >
            {isLoading ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Work Order'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default WorkOrderForm

