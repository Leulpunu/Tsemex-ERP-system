import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { 
  TrendingUp, BarChart3, Target, Clock, CheckCircle2 
} from 'lucide-react'
import { getKpis } from '../../store/slices/kpiSlice'

const KPIDashboard = () => {
  const dispatch = useDispatch()
  const { kpis } = useSelector((state) => state.kpis)
  const { departments = [] } = useSelector((state) => state.departments)

  useEffect(() => {
    dispatch(getKpis({ period: 'current' }))
  }, [dispatch])

  const getDepartmentKPIs = (departmentId) => {
    return kpis.filter(kpi => kpi.departmentId._id === departmentId)
  }

  const kpiProgress = (kpi) => {
    return kpi.actualValue / kpi.targetValue * 100
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Target className="text-blue-600" size={32} />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">KPI Dashboard</h1>
          <p className="text-gray-600">Performance metrics across departments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total KPIs</p>
              <p className="text-3xl font-bold text-gray-900">{kpis.length}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">On Track</p>
              <p className="text-3xl font-bold text-green-600">
                {kpis.filter(k => kpiProgress(k) >= 80).length}
              </p>
            </div>
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Needs Attention</p>
              <p className="text-3xl font-bold text-orange-600">
                {kpis.filter(k => kpiProgress(k) < 80 && kpiProgress(k) >= 50).length}
              </p>
            </div>
            <Clock className="w-12 h-12 text-orange-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">Department KPIs</h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {departments.map(department => {
            const deptKpis = getDepartmentKPIs(department._id)
            const avgProgress = deptKpis.reduce((sum, kpi) => sum + kpiProgress(kpi), 0) / deptKpis.length || 0
            
            return (
              <div key={department._id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <div className={`w-6 h-6 bg-purple-600 rounded text-white font-bold text-xs`}>
                        {department.type?.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{department.name}</h3>
                      <p className="text-sm text-gray-500">{department.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{Math.round(avgProgress)}%</p>
                    <p className="text-sm text-gray-500">{deptKpis.length} KPIs</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {deptKpis.slice(0, 6).map(kpi => (
                    <div key={kpi._id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900 truncate">{kpi.title}</span>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          kpiProgress(kpi) >= 90 ? 'bg-green-100 text-green-800' :
                          kpiProgress(kpi) >= 70 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {Math.round(kpiProgress(kpi))}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            kpiProgress(kpi) >= 90 ? 'bg-green-500' :
                            kpiProgress(kpi) >= 70 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(kpiProgress(kpi), 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                {deptKpis.length > 6 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Link 
                      to={`/kpis?department=${department._id}`}
                      className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                    >
                      View all {deptKpis.length} KPIs →
                    </Link>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <Link
          to="/tasks"
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl text-center transition-all"
        >
          Assign KPI-linked Task
        </Link>
        <Link
          to="/tasks"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl text-center transition-all"
        >
          Manage Tasks
        </Link>
      </div>
    </div>
  )
}

export default KPIDashboard

