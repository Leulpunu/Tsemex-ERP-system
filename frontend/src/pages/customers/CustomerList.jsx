import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Search, Plus, Pencil } from 'lucide-react'
import { getCustomers } from '../../store/slices/customerSlice'
import toast from 'react-hot-toast'

const CustomerList = () => {
  const dispatch = useDispatch()
  const { customers, isLoading, isError, message } = useSelector((state) => state.customers)
  const { currentCompany } = useSelector((state) => state.company)
  const { user } = useSelector((state) => state.auth)
  const [q, setQ] = useState('')

  useEffect(() => {
    const companyId = user?.role === 'super_admin' ? currentCompany?._id : undefined
    dispatch(getCustomers(companyId ? { companyId } : undefined))
  }, [dispatch, currentCompany?._id, user?.role])

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return customers
    return customers.filter((c) => String(c.name || '').toLowerCase().includes(query))
  }, [customers, q])

  useEffect(() => {
    if (isError && message) toast.error(message)
  }, [isError, message])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search customers..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>
          <Link className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" to="/customers/new">
            <Plus size={18} />
            New Customer
          </Link>
        </div>
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {message || 'Failed to load customers'}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {!isLoading && filtered.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                  No customers found.{' '}
                  <Link to="/customers/new" className="text-blue-600 hover:underline">
                    Create one now
                  </Link>
                </td>
              </tr>
            ) : (
              filtered.map((customer) => (
                <tr key={customer._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/customers/${customer._id}/edit`}
                      className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-2"
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

export default CustomerList
