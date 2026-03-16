import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Wrench, Plus, Pencil } from 'lucide-react'
import { createWorkOrder, getWorkOrders, updateWorkOrder } from '../../store/slices/workOrderSlice'

const WorkOrderList = () => {
  const dispatch = useDispatch()
  const { workOrders, isLoading, isError, message } = useSelector((state) => state.workOrders)
  const { currentCompany } = useSelector((state) => state.company)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    const companyId = user?.role === 'super_admin' ? currentCompany?._id : undefined
    dispatch(getWorkOrders(companyId ? { companyId } : undefined))
  }, [dispatch, currentCompany?._id, user?.role])

  const onCreate = async () => {
    const title = prompt('Work order title')
    if (!title) return
    const type =
      (prompt('Type (installation/repair/maintenance/inspection/emergency/other)', 'maintenance') || 'maintenance').toLowerCase()
    const allowed = ['installation', 'repair', 'maintenance', 'inspection', 'emergency', 'other']
    if (!allowed.includes(type)) return
    const priority = (prompt('Priority (low/medium/high/urgent)', 'medium') || 'medium').toLowerCase()
    const companyId = user?.role === 'super_admin' ? currentCompany?._id : undefined
    await dispatch(createWorkOrder({ workOrderData: { title, type, priority }, companyId }))
  }

  const onEdit = async (wo) => {
    const status =
      (prompt('Status (pending/assigned/in_progress/on_hold/completed/cancelled)', wo.status) || wo.status).toLowerCase()
    await dispatch(updateWorkOrder({ id: wo._id, workOrderData: { status } }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wrench size={28} className="text-orange-600" />
          <h1 className="text-2xl font-bold text-gray-800">Work Orders</h1>
        </div>
        <button
          type="button"
          onClick={onCreate}
          className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
        >
          <Plus size={18} />
          New Work Order
        </button>
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {message || 'Failed to load work orders'}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 text-sm text-gray-500">
          {isLoading ? 'Loading…' : `${workOrders.length} work order(s)`}
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {!isLoading && workOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                  No work orders found. Create your first work order.
                </td>
              </tr>
            ) : (
              workOrders.map((wo) => (
                <tr key={wo._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{wo.workOrderNumber || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{wo.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{wo.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{wo.priority}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{wo.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      type="button"
                      onClick={() => onEdit(wo)}
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

export default WorkOrderList
