import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Hotel, Plus, Pencil } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getProperties } from '../../store/slices/propertySlice'

const PropertyList = () => {
  const dispatch = useDispatch()
  const { properties, isLoading, isError, message } = useSelector((state) => state.properties)
  const { currentCompany } = useSelector((state) => state.company)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    const companyId = user?.role === 'super_admin' ? currentCompany?._id : undefined
    dispatch(getProperties(companyId ? { companyId } : undefined))
  }, [dispatch, currentCompany?._id, user?.role])

  useEffect(() => {
    if (isError && message) toast.error(message)
  }, [isError, message])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Hotel size={28} className="text-teal-600" />
          <h1 className="text-2xl font-bold text-gray-800">Properties</h1>
        </div>
        <Link className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700" to="/properties/new">
          <Plus size={18} />
          New Property
        </Link>
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {message || 'Failed to load properties'}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 text-sm text-gray-500">
          {isLoading ? 'Loading…' : `${properties.length} propert(ies)`}
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {!isLoading && properties.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                  No properties found. Create your first property.
                </td>
              </tr>
            ) : (
              properties.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{p.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {[p.address?.city, p.address?.country].filter(Boolean).join(', ') || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/properties/${p._id}/edit`}
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-900"
                    >
                      <Pencil size={16} /> Edit
                    </Link>
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

export default PropertyList
