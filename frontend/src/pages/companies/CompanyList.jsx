import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Building2, Plus, Pencil, Trash2, CheckCircle2 } from 'lucide-react'
import { deleteCompany, getCompanies, setCurrentCompany } from '../../store/slices/companySlice'

const CompanyList = () => {
  const dispatch = useDispatch()
  const { companies, currentCompany, isLoading, isError, message } = useSelector((state) => state.company)

  useEffect(() => {
    dispatch(getCompanies())
  }, [dispatch])

  const onDelete = async (id) => {
    if (!confirm('Delete this company? This cannot be undone.')) return
    await dispatch(deleteCompany(id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Building2 className="text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Companies</h1>
        </div>
        <Link
          to="/companies/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg"
        >
          <Plus size={18} />
          Add Company
        </Link>
      </div>

      {isError && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {message || 'Failed to load companies'}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <p className="text-sm text-gray-500">
            {isLoading ? 'Loading…' : `${companies.length} company(ies)`}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">Name</th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">Type</th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">Email</th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">Phone</th>
                <th className="text-right text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {companies.map((c) => {
                const isCurrent = currentCompany?._id === c._id
                return (
                  <tr key={c._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => dispatch(setCurrentCompany(c))}
                          className="text-left"
                          title="Set as current company"
                        >
                          <div className="font-semibold text-gray-900 flex items-center gap-2">
                            {c.name}
                            {isCurrent && <CheckCircle2 size={16} className="text-green-600" />}
                          </div>
                          <div className="text-sm text-gray-500">{c.address?.country || ''}</div>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{c.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{c.email || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{c.phone || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/companies/${c._id}/edit`}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 text-sm"
                        >
                          <Pencil size={16} />
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => onDelete(c._id)}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 hover:bg-red-50 text-red-700 text-sm"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}

              {!isLoading && companies.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    No companies yet. Create your first one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CompanyList
