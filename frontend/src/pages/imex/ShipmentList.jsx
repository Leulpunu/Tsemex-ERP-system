import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Globe, Plus, Pencil } from 'lucide-react'
import { createShipment, getShipments, updateShipment } from '../../store/slices/shipmentSlice'

const ShipmentList = () => {
  const dispatch = useDispatch()
  const { shipments, isLoading, isError, message } = useSelector((state) => state.shipments)
  const { currentCompany } = useSelector((state) => state.company)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    const companyId = user?.role === 'super_admin' ? currentCompany?._id : undefined
    dispatch(getShipments(companyId ? { companyId } : undefined))
  }, [dispatch, currentCompany?._id, user?.role])

  const onCreate = async () => {
    const type = (prompt('Type (import/export/transit)', 'import') || 'import').toLowerCase()
    if (!['import', 'export', 'transit'].includes(type)) return
    const originCountry = prompt('Origin country (optional)') || ''
    const destinationCountry = prompt('Destination country (optional)') || ''
    const status = 'pending'
    const companyId = user?.role === 'super_admin' ? currentCompany?._id : undefined
    await dispatch(
      createShipment({
        shipmentData: { type, status, origin: { country: originCountry }, destination: { country: destinationCountry } },
        companyId,
      })
    )
  }

  const onEdit = async (shipment) => {
    const status =
      (prompt(
        'Status (pending/picked_up/in_transit/customs_clearance/delivered/cancelled)',
        String(shipment.status || 'pending').trim()
      ) || shipment.status) + ''
    await dispatch(updateShipment({ id: shipment._id, shipmentData: { status } }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Globe size={28} className="text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Shipments</h1>
        </div>
        <button
          type="button"
          onClick={onCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} />
          New Shipment
        </button>
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {message || 'Failed to load shipments'}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 text-sm text-gray-500">
          {isLoading ? 'Loading…' : `${shipments.length} shipment(s)`}
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origin</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {!isLoading && shipments.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                  No shipments found. Create your first shipment.
                </td>
              </tr>
            ) : (
              shipments.map((s) => (
                <tr key={s._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.shipmentNumber || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.origin?.country || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.destination?.country || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{String(s.status || '').trim()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      type="button"
                      onClick={() => onEdit(s)}
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-900"
                    >
                      <Pencil size={16} /> Update Status
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ShipmentList
