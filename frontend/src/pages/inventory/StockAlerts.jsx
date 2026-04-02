import { useEffect } from 'react'
import { useGetStockAlertsQuery, useGenerateAlertsMutation, useResolveAlertMutation, useGetAlertCountQuery } from '../../store/slices/stockAlertSlice'
import { Bell, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

const StockAlerts = () => {
  const { data: alerts = [], isLoading } = useGetStockAlertsQuery()
  const { data: countData } = useGetAlertCountQuery()
  const [generateAlerts, { isLoading: generating }] = useGenerateAlertsMutation()
  const [resolveAlert, { isLoading: resolving }] = useResolveAlertMutation()
  const unreadCount = countData?.count || 0

  const handleGenerate = async () => {
    const toastId = toast.loading('Scanning for low stock...')
    try {
      await generateAlerts().unwrap()
      toast.success('Stock alerts updated', { id: toastId })
    } catch {
      toast.error('Failed to generate alerts', { id: toastId })
    }
  }

  const handleResolve = async (id) => {
    if (!confirm('Mark this alert as resolved?')) return
    const toastId = toast.loading('Resolving...')
    try {
      await resolveAlert(id).unwrap()
      toast.success('Alert resolved', { id: toastId })
    } catch {
      toast.error('Failed to resolve alert', { id: toastId })
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center p-8"><RefreshCw className="animate-spin" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-8 h-8 text-orange-500" />
          <h1 className="text-2xl font-bold text-gray-800">Stock Alerts ({unreadCount})</h1>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
          Scan Now
        </button>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <CheckCircle className="w-16 h-16 mx-auto text-green-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No stock alerts</h3>
          <p>All stock levels are good. Click "Scan Now" to check again.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {alerts.map((alert) => (
            <div key={alert._id} className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-orange-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {alert.productId.name} ({alert.productId.sku})
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <span>Stock: <strong className="text-orange-600">{alert.currentStock}</strong></span>
                    <span>•</span>
                    <span>Reorder: <strong className="text-orange-600">{alert.reorderLevel}</strong></span>
                    <span>•</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      alert.alertType === 'out_of_stock' ? 'bg-red-100 text-red-800' :
                      alert.alertType === 'reorder' ? 'bg-yellow-100 text-yellow-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {alert.alertType.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      Created {new Date(alert.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleResolve(alert._id)}
                      disabled={resolving || alert.status === 'resolved'}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
                    >
                      <CheckCircle className="w-3 h-3" />
                      Resolve
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default StockAlerts

