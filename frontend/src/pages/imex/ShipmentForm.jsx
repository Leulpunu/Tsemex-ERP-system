import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { clearSelectedShipment, createShipment, getShipment, updateShipment } from '../../store/slices/shipmentSlice'

const ShipmentForm = () => {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { selectedShipment, isLoading, isError, message } = useSelector((state) => state.shipments)
  const { currentCompany } = useSelector((state) => state.company)
  const { user } = useSelector((state) => state.auth)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: 'import',
      status: 'pending',
      originCountry: '',
      destinationCountry: '',
      carrier: '',
      trackingNumber: '',
    },
  })

  useEffect(() => {
    if (!isEdit) {
      dispatch(clearSelectedShipment())
      return
    }
    dispatch(getShipment(id))
    return () => dispatch(clearSelectedShipment())
  }, [dispatch, id, isEdit])

  useEffect(() => {
    if (!isEdit) return
    if (!selectedShipment?._id) return
    reset({
      type: selectedShipment.type || 'import',
      status: String(selectedShipment.status || 'pending').trim(),
      originCountry: selectedShipment.origin?.country || '',
      destinationCountry: selectedShipment.destination?.country || '',
      carrier: selectedShipment.carrier || '',
      trackingNumber: selectedShipment.trackingNumber || '',
    })
  }, [isEdit, reset, selectedShipment])

  useEffect(() => {
    if (isError && message) toast.error(message)
  }, [isError, message])

  const onSubmit = async (data) => {
    const payload = {
      type: data.type,
      status: data.status,
      origin: { country: data.originCountry || '' },
      destination: { country: data.destinationCountry || '' },
      carrier: data.carrier || '',
      trackingNumber: data.trackingNumber || '',
    }

    try {
      if (isEdit) {
        await dispatch(updateShipment({ id, shipmentData: payload })).unwrap()
        toast.success('Shipment updated')
      } else {
        const companyId = user?.role === 'super_admin' ? currentCompany?._id : undefined
        await dispatch(createShipment({ shipmentData: payload, companyId })).unwrap()
        toast.success('Shipment created')
      }
      navigate('/shipments')
    } catch {
      // handled by slice message + toast effect
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? 'Edit Shipment' : 'New Shipment'}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm p-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Type</label>
            <select
              {...register('type', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="import">import</option>
              <option value="export">export</option>
              <option value="transit">transit</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
            <select
              {...register('status', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">pending</option>
              <option value="picked_up">picked_up</option>
              <option value="in_transit">in_transit</option>
              <option value="customs_clearance">customs_clearance</option>
              <option value="delivered">delivered</option>
              <option value="cancelled">cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Origin country</label>
            <input
              {...register('originCountry')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Destination country</label>
            <input
              {...register('destinationCountry')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Carrier (optional)</label>
            <input
              {...register('carrier')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Tracking number (optional)</label>
            <input
              {...register('trackingNumber')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {errors.type && <p className="text-sm text-red-600 mt-2">Type is required</p>}

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={() => navigate('/shipments')}
            className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            {isLoading ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Shipment'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ShipmentForm

