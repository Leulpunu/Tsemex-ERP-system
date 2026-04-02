import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { clearSelectedInvoice, createInvoice, getInvoice, updateInvoice } from '../../store/slices/invoiceSlice'
import { getCustomers } from '../../store/slices/customerSlice'
import { getSuppliers } from '../../store/slices/supplierSlice'

const toISODateTime = (d) => new Date(d).toISOString()

const InvoiceForm = () => {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { selectedInvoice, isLoading, isError, message } = useSelector((state) => state.invoices)
  const { currentCompany } = useSelector((state) => state.company)
  const { user } = useSelector((state) => state.auth)
  const { customers } = useSelector((state) => state.customers)
  const { suppliers } = useSelector((state) => state.suppliers)

  const companyParam = user?.role === 'super_admin' ? currentCompany?._id : undefined

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      invoiceType: 'sale',
      customerId: '',
      supplierId: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      taxRate: 0,
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      issueDate: new Date().toISOString().slice(0, 10),
    },
  })

  const invoiceType = watch('invoiceType')

  useEffect(() => {
    dispatch(getCustomers(companyParam ? { companyId: companyParam } : undefined))
    dispatch(getSuppliers(companyParam ? { companyId: companyParam } : undefined))
  }, [dispatch, companyParam])

  useEffect(() => {
    if (!isEdit) {
      dispatch(clearSelectedInvoice())
      return
    }
    dispatch(getInvoice(id))
    return () => dispatch(clearSelectedInvoice())
  }, [dispatch, id, isEdit])

  useEffect(() => {
    if (!isEdit) return
    if (!selectedInvoice?._id) return

    reset({
      invoiceType: selectedInvoice.invoiceType || 'sale',
      customerId: selectedInvoice.customerId?._id || selectedInvoice.customerId || '',
      supplierId: selectedInvoice.supplierId?._id || selectedInvoice.supplierId || '',
      description: selectedInvoice.items?.[0]?.description || '',
      quantity: selectedInvoice.items?.[0]?.quantity || 1,
      unitPrice: selectedInvoice.items?.[0]?.unitPrice || 0,
      taxRate: selectedInvoice.items?.[0]?.taxRate ?? 0,
      dueDate: selectedInvoice.dueDate ? String(selectedInvoice.dueDate).slice(0, 10) : new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      issueDate: selectedInvoice.issueDate ? String(selectedInvoice.issueDate).slice(0, 10) : new Date().toISOString().slice(0, 10),
    })
  }, [dispatch, isEdit, reset, selectedInvoice])

  useEffect(() => {
    if (isError && message) toast.error(message)
  }, [isError, message])

  const onSubmit = async (data) => {
    const quantity = Number(data.quantity)
    const unitPrice = Number(data.unitPrice)
    const taxRate = Number(data.taxRate || 0)

    const subtotal = quantity * unitPrice
    const taxAmount = subtotal * (taxRate / 100)
    const total = subtotal + taxAmount

    const payload = {
      invoiceType: data.invoiceType,
      customerId: data.invoiceType === 'sale' ? data.customerId : undefined,
      supplierId: data.invoiceType === 'purchase' ? data.supplierId : undefined,
      items: [
        {
          description: data.description,
          quantity,
          unitPrice,
          taxRate,
          taxAmount,
          total,
        },
      ],
      subtotal,
      taxTotal: taxAmount,
      discount: 0,
      total,
      paidAmount: 0,
      balanceDue: total,
      status: 'draft',
      issueDate: toISODateTime(data.issueDate),
      dueDate: toISODateTime(data.dueDate),
    }

    try {
      if (isEdit) {
        await dispatch(updateInvoice({ id, invoiceData: payload })).unwrap()
        toast.success('Invoice updated')
      } else {
        await dispatch(createInvoice({ invoiceData: payload, companyId: companyParam })).unwrap()
        toast.success('Invoice created')
      }
      navigate('/invoices')
    } catch {
      // slice message + toast effect
    }
  }

  const isSale = invoiceType === 'sale'
  const isPurchase = invoiceType === 'purchase'

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? 'Edit Invoice' : 'New Invoice'}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm p-6 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Invoice type</label>
            <select
              {...register('invoiceType', { required: 'Invoice type is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="sale">sale</option>
              <option value="purchase">purchase</option>
            </select>
            {errors.invoiceType && <p className="text-sm text-red-600 mt-1">{errors.invoiceType.message}</p>}
          </div>

          {isSale && (
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Customer</label>
              <select
                {...register('customerId', { required: 'Customer is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select customer</option>
                {customers.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.customerId && <p className="text-sm text-red-600 mt-1">{errors.customerId.message}</p>}
            </div>
          )}

          {isPurchase && (
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Supplier</label>
              <select
                {...register('supplierId', { required: 'Supplier is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select supplier</option>
                {suppliers.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
              {errors.supplierId && <p className="text-sm text-red-600 mt-1">{errors.supplierId.message}</p>}
            </div>
          )}

          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">Item description</label>
            <input
              {...register('description', { required: 'Description is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Quantity</label>
            <input
              type="number"
              step="1"
              {...register('quantity', { required: true, min: { value: 1, message: 'Quantity must be >= 1' } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.quantity && <p className="text-sm text-red-600 mt-1">{errors.quantity.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Unit price</label>
            <input
              type="number"
              step="0.01"
              {...register('unitPrice', { required: true, min: { value: 0, message: 'Unit price must be >= 0' } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.unitPrice && <p className="text-sm text-red-600 mt-1">{errors.unitPrice.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Tax rate (%)</label>
            <input
              type="number"
              step="0.01"
              {...register('taxRate', { required: true, min: { value: 0, message: 'Tax rate must be >= 0' } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.taxRate && <p className="text-sm text-red-600 mt-1">{errors.taxRate.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Issue date</label>
            <input type="date" {...register('issueDate', { required: true })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">Due date</label>
            <input type="date" {...register('dueDate', { required: true })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={() => navigate('/invoices')}
            className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold"
          >
            {isLoading ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Invoice'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default InvoiceForm

