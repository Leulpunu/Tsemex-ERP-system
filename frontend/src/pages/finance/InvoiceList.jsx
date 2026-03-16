import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FileText, Plus, Trash2 } from 'lucide-react'
import { createInvoice, deleteInvoice, getInvoices } from '../../store/slices/invoiceSlice'

const InvoiceList = () => {
  const dispatch = useDispatch()
  const { invoices, isLoading, isError, message } = useSelector((state) => state.invoices)
  const { currentCompany } = useSelector((state) => state.company)
  const { user } = useSelector((state) => state.auth)
  const { customers } = useSelector((state) => state.customers)

  useEffect(() => {
    const companyId = user?.role === 'super_admin' ? currentCompany?._id : undefined
    dispatch(getInvoices(companyId ? { companyId } : undefined))
  }, [dispatch, currentCompany?._id, user?.role])

  const onCreate = async () => {
    // Minimal invoice creation (1 line item) to make the module functional.
    const invoiceType = (prompt('Invoice type: sale or purchase', 'sale') || 'sale').toLowerCase()
    if (invoiceType !== 'sale' && invoiceType !== 'purchase') return

    let customerId
    let supplierId
    if (invoiceType === 'sale') {
      const customerName = prompt('Customer name (optional). If you already have customers, type exact name to link.') || ''
      const customer = customers.find((c) => c.name === customerName)
      customerId = customer?._id
    } else {
      supplierId = undefined
    }

    const desc = prompt('Item description', 'Service') || 'Service'
    const qty = Number(prompt('Quantity', '1') || '1')
    const unitPrice = Number(prompt('Unit price', '0') || '0')
    if (!Number.isFinite(qty) || qty <= 0) return
    if (!Number.isFinite(unitPrice) || unitPrice < 0) return

    const subtotal = qty * unitPrice
    const taxTotal = 0
    const total = subtotal + taxTotal
    const dueDate = prompt('Due date (YYYY-MM-DD)', new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10))
    if (!dueDate) return

    const invoiceData = {
      invoiceType,
      customerId,
      supplierId,
      items: [{ description: desc, quantity: qty, unitPrice, taxRate: 0, taxAmount: 0, total }],
      subtotal,
      taxTotal,
      discount: 0,
      total,
      paidAmount: 0,
      balanceDue: total,
      status: 'draft',
      issueDate: new Date().toISOString(),
      dueDate: new Date(dueDate).toISOString(),
    }

    const companyId = user?.role === 'super_admin' ? currentCompany?._id : undefined
    await dispatch(createInvoice({ invoiceData, companyId }))
  }

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
        <button
          type="button"
          onClick={onCreate}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          <Plus size={18} />
          New Invoice
        </button>
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
