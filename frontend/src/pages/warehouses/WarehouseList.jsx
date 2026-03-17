import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Plus, Trash2, Home, Pencil } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { deleteWarehouse, getWarehouses } from '../../store/slices/warehouseSlice'

const WarehouseList = () => {
  const dispatch = useDispatch()
  const { warehouses, isLoading, isError, message } = useSelector((state) => state.warehouses)
  const { currentCompany } = useSelector((state) => state.company)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    const companyId = user?.role === 'super_admin' ? currentCompany?._id : undefined
    dispatch(getWarehouses(companyId ? { companyId } : undefined))
  }, [dispatch, currentCompany?._id, user?.role])

  const onDelete = async (id) => {
    if (!confirm('Delete this warehouse?')) return
    await dispatch(deleteWarehouse(id))
    toast.success('Warehouse deleted')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Home size={28} className="text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Warehouses</h1>
        </div>
        <Link className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" to="/warehouses/new">
          <Plus size={18} />
          New Warehouse
        </Link>
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {message || 'Failed to load warehouses'}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {!isLoading && warehouses.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                  No warehouses found. Create your first warehouse to get started.
                </td>
              </tr>
            ) : (
              warehouses.map((warehouse) => (
                <tr key={warehouse._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {warehouse.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {[warehouse.address?.city, warehouse.address?.country].filter(Boolean).join(', ') || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{warehouse.capacity ?? '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/warehouses/${warehouse._id}/edit`}
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Pencil size={16} /> Edit
                    </Link>
                    <button type="button" onClick={() => onDelete(warehouse._id)} className="text-red-600 hover:text-red-900">
                      <Trash2 size={16} />
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

export default WarehouseList
