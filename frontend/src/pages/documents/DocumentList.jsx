import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { 
  Upload, FileText, Download, Trash2, Eye, Filter, Search, Clock, 
  File, Loader2 
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { getDocuments, deleteDocument, uploadDocument, reset } from '../../store/slices/documentSlice'

const DocumentList = () => {
  const dispatch = useDispatch()
  const { documents, isLoading, isError, message, pagination } = useSelector((state) => state.documents)

  const [filters, setFilters] = useState({ category: '', search: '', page: 1 })
  const [uploadModal, setUploadModal] = useState(false)
  const [uploadForm, setUploadForm] = useState({ title: '', description: '', category: 'INVOICE' })
  const [uploadFile, setUploadFile] = useState(null)

  useEffect(() => {
    dispatch(getDocuments(filters))
  }, [dispatch, filters.page, filters.category, filters.search])

  useEffect(() => {
    if (message) {
      toast.success(message)
      dispatch(reset())
    }
    if (isError) {
      toast.error(message)
      dispatch(reset())
    }
  }, [message, isError, dispatch])

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!uploadFile) return toast.error('Please select a file')

    const formData = new FormData()
    formData.append('title', uploadForm.title)
    formData.append('description', uploadForm.description)
    formData.append('category', uploadForm.category)
    formData.append('file', uploadFile)

    dispatch(uploadDocument(formData))
    setUploadModal(false)
    setUploadForm({ title: '', description: '', category: 'INVOICE' })
    setUploadFile(null)
  }

  const handleDelete = (id) => {
    if (confirm('Delete this document?')) {
      dispatch(deleteDocument(id))
    }
  }

  const categoryIcons = {
    INVOICE: FileText,
    PURCHASE_ORDER: FileText,
    CONTRACT: File,
    CUSTOMS_DOC: File,
    SHIPMENT: Clock,
    RECEIPT: FileText,
    OTHER: File
  }

  const categoryColors = {
    INVOICE: 'bg-blue-100 text-blue-800',
    PURCHASE_ORDER: 'bg-green-100 text-green-800',
    CONTRACT: 'bg-purple-100 text-purple-800',
    CUSTOMS_DOC: 'bg-orange-100 text-orange-800',
    SHIPMENT: 'bg-indigo-100 text-indigo-800',
    RECEIPT: 'bg-emerald-100 text-emerald-800',
    OTHER: 'bg-gray-100 text-gray-800'
  }

  const Button = ({ children, variant = 'default', size = 'default', onClick, disabled, className = '' }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2
        ${variant === 'outline' ? 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700' : 
          disabled ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}
        ${size === 'sm' ? 'px-3 py-1.5 text-sm' : 'text-sm'}
        ${className}
      `}
    >
      {disabled && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
      {children}
    </button>
  )

  const Input = ({ id, type = 'text', value, onChange, placeholder, required, className = '' }) => (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`
        w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
        ${className}
      `}
    />
  )

  const SelectTrigger = ({ children, onClick }) => (
    <button
      onClick={onClick}
      className="flex items-center gap-2 w-full px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
    >
      {children}
    </button>
  )

  const Badge = ({ children, className = '' }) => (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  )

  const Card = ({ children, className = '' }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
      {children}
    </div>
  )

  const CardHeader = ({ children }) => <div className="p-6 pb-3">{children}</div>
  const CardContent = ({ children }) => <div className="p-6">{children}</div>
  const CardTitle = ({ children }) => <h3 className="font-semibold text-lg">{children}</h3>
  const CardDescription = ({ children }) => <p className="text-sm text-gray-500">{children}</p>

  const Dialog = ({ open, onOpenChange, children, trigger }) => {
    if (!open) return trigger
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {children}
        </div>
      </div>
    )
  }

  const DialogTrigger = ({ children, asChild }) => children

  const DialogContent = ({ children }) => children

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-gray-600">Manage invoices, contracts and scanned documents</p>
        </div>
        <button
          onClick={() => setUploadModal(true)}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center gap-2 transition-all"
          disabled={isLoading}
        >
          <Upload className="h-4 w-4" />
          Upload Document
        </button>
      </div>

      {/* Upload Modal */}
      {uploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">Upload Document</h2>
              <p className="text-gray-600 mt-1">Select PDF or image file</p>
            </div>
            <form onSubmit={handleUpload} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <Input
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                  placeholder="Invoice #12345"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                <Input
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                  placeholder="Payment for Q1 services"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <div className="relative">
                  <select 
                    value={uploadForm.category} 
                    onChange={(e) => setUploadForm({...uploadForm, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    required
                  >
                    <option value="INVOICE">Invoice</option>
                    <option value="PURCHASE_ORDER">Purchase Order</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="CUSTOMS_DOC">Customs Document</option>
                    <option value="SHIPMENT">Shipment</option>
                    <option value="RECEIPT">Receipt</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
                <Input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-1 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {isLoading ? 'Uploading...' : 'Upload'}
                </button>
                <button
                  type="button"
                  onClick={() => setUploadModal(false)}
                  className="px-6 py-2.5 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex gap-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select 
                value={filters.category} 
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="INVOICE">Invoices</option>
                <option value="PURCHASE_ORDER">Purchase Orders</option>
                <option value="CONTRACT">Contracts</option>
                <option value="CUSTOMS_DOC">Customs Docs</option>
                <option value="SHIPMENT">Shipments</option>
                <option value="RECEIPT">Receipts</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 flex-1">
            <Search className="h-4 w-4 text-gray-400 mt-2" />
            <input
              placeholder="Search documents..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(6).fill().map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse h-64"></div>
          ))
        ) : documents.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <File className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents</h3>
            <p className="text-gray-500 mb-6">Upload your first document to get started</p>
            <button
              onClick={() => setUploadModal(true)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center gap-2 mx-auto transition-all"
            >
              <Upload className="h-4 w-4" />
              Upload First Document
            </button>
          </div>
        ) : (
          documents.map((doc) => {
            const Icon = categoryIcons[doc.category] || File
            return (
              <div key={doc._id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all group">
                <div className="p-6 pb-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${categoryColors[doc.category] || 'bg-gray-100'}`}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{doc.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[doc.category]?.replace('text', 'bg') || 'bg-gray-100 text-gray-800'}`}>
                          {doc.category.replace('_', ' ').toLowerCase()}
                        </span>
                        {doc.fileSize && (
                          <span className="text-xs text-gray-500">
                            {(doc.fileSize / 1024 / 1024).toFixed(1)} MB
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <div className="space-y-2 text-sm text-gray-600">
                    {doc.description && (
                      <p className="line-clamp-2">{doc.description}</p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>Uploaded {new Date(doc.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="px-6 pb-6 opacity-0 group-hover:opacity-100 transition-all">
                  <div className="flex gap-2 pt-2">
                    <a 
                      href={doc.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 hover:bg-gray-50 rounded-lg transition-all"
                    >
                      <Eye className="h-4 w-4" />
                      Preview
                    </a>
                    <a 
                      href={doc.fileUrl} 
                      download={doc.fileName}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 hover:bg-gray-50 rounded-lg transition-all"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </a>
                    <button 
                      onClick={() => handleDelete(doc._id)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all ml-auto"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="text-sm text-gray-600">
            Showing {documents.length} of {pagination.count} documents
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setFilters({...filters, page: Math.max(1, filters.page - 1)})}
              disabled={filters.page === 1}
              className="px-3 py-1.5 text-sm border border-gray-300 bg-white hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            <button
              onClick={() => setFilters({...filters, page: filters.page + 1})}
              disabled={filters.page === pagination.pages}
              className="px-3 py-1.5 text-sm border border-gray-300 bg-white hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DocumentList

