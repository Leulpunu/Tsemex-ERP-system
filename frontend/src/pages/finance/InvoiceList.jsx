import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FileText, Plus, Trash2, Pencil } from 'lucide-react'
import { Link } from 'react-router-dom'
import { deleteInvoice, getInvoices } from '../../store/slices/invoiceSlice'

const InvoiceList = () => {
  const dispatch = useDispatch()
  const { invoices, isLoading, isError, message } = useSelector((state) => state.invoices)
  const { currentCompany } = useSelector((state) => state.company)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    const companyId = user?.role === 'super_admin' ? currentCompany?._id : undefined
    dispatch(getInvoices(companyId ? { companyId } : undefined))
  }, [dispatch, currentCompany?._id, user?.role])

  const onDelete = async (id) => {
    if (!confirm('Delete this invoice?')) return
    await dispatch(deleteInvoice(id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText size={28} className="text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-800">Invoices</h1>
        </div>
          <Link
            to="/invoices/new"
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
          <Plus size={18} />
          New Invoice
          </Link>
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {message || 'Failed to load invoices'}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 text-sm text-gray-500">
          {isLoading ? 'Loading…' : `${invoices.length} invoice(s)`}
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {!isLoading && invoices.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                  No invoices found. Create your first invoice.
                </td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr key={inv._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{inv.invoiceNumber || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{inv.invoiceType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{inv.customerId?.name || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{inv.total}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{inv.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/invoices/${inv._id}/edit`}
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Pencil size={16} /> Edit
                    </Link>
                    <button type="button" onClick={() => onDelete(inv._id)} className="text-red-600 hover:text-red-900">
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

export default InvoiceList
