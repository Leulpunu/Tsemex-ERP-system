import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Plus, Trash2, Pencil, Package, Search } from 'lucide-react'
import { createProduct, deleteProduct, getProducts, updateProduct } from '../../store/slices/productSlice'

const ProductList = () => {
  const dispatch = useDispatch()
  const { products, isLoading, isError, message } = useSelector((state) => state.products)
  const { currentCompany } = useSelector((state) => state.company)
  const { user } = useSelector((state) => state.auth)
  const [q, setQ] = useState('')

  useEffect(() => {
    const companyId = user?.role === 'super_admin' ? currentCompany?._id : undefined
    dispatch(getProducts(companyId ? { companyId } : undefined))
  }, [dispatch, currentCompany?._id, user?.role])

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return products
    return products.filter((p) => {
      const hay = `${p.name || ''} ${p.sku || ''} ${p.category || ''}`.toLowerCase()
      return hay.includes(query)
    })
  }, [products, q])

  const onCreate = async () => {
    const name = prompt('Product name')
    if (!name) return
    const sku = prompt('SKU (required, unique per company)')
    if (!sku) return
    const category = prompt('Category (optional)') || ''
    const companyId = user?.role === 'super_admin' ? currentCompany?._id : undefined
    await dispatch(createProduct({ productData: { name, sku, category }, companyId }))
  }

  const onEdit = async (product) => {
    const name = prompt('Product name', product.name)
    if (!name) return
    const sku = prompt('SKU (required)', product.sku)
    if (!sku) return
    const category = prompt('Category (optional)', product.category || '') || ''
    await dispatch(updateProduct({ id: product._id, productData: { name, sku, category } }))
  }

  const onDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    await dispatch(deleteProduct(id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package size={28} className="text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
            />
          </div>
          <button
            type="button"
            onClick={onCreate}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            <Plus size={18} />
            New Product
          </button>
        </div>
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {message || 'Failed to load products'}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {!isLoading && filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                  No products found.{' '}
                  <button type="button" onClick={onCreate} className="text-indigo-600 hover:underline">
                    Create one now
                  </button>
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{p.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.category || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.currentStock ?? 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      type="button"
                      onClick={() => onEdit(p)}
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Pencil size={16} /> Edit
                    </button>
                    <button type="button" onClick={() => onDelete(p._id)} className="text-red-600 hover:text-red-900">
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

export default ProductList
