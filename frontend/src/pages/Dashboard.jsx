import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { getCompanies } from '../store/slices/companySlice'
import { 
  Users, Building2, Package, HardHat, DollarSign, FileText, BarChart3, 
  Bell, Truck 
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { companies, currentCompany } = useSelector((state) => state.company)

  useEffect(() => {
    dispatch(getCompanies())
  }, [dispatch])

  const stats = [
    { label: 'Total Employees', value: '124', icon: Users, color: 'bg-blue-500', href: '/employees' },
    { label: 'Active Projects', value: '12', icon: HardHat, color: 'bg-green-500', href: '/projects' },
    { label: 'Total Revenue', value: '$2.4M', icon: DollarSign, color: 'bg-yellow-500', href: '/invoices' },
    { label: 'Pending Invoices', value: '28', icon: FileText, color: 'bg-purple-500', href: '/invoices' },
    { label: 'Stock Items', value: '1,245', icon: Package, color: 'bg-indigo-500', href: '/products' },
    { label: 'Announcements', value: '3', icon: Bell, color: 'bg-orange-500', href: '/announcements' },
  ]

  const chartData = [
    { month: 'Jan', revenue: 4000, expenses: 2400 },
    { month: 'Feb', revenue: 3000, expenses: 1398 },
    { month: 'Mar', revenue: 2000, expenses: 9800 },
    { month: 'Apr', revenue: 2780, expenses: 3908 },
    { month: 'May', revenue: 1890, expenses: 4800 },
    { month: 'Jun', revenue: 2390, expenses: 3800 },
  ]

  const recentActivities = [
    { id: 1, action: 'New employee added', module: 'HR', time: '2 hours ago', href: '/employees' },
    { id: 2, action: 'Project "Tower A" updated', module: 'Projects', time: '4 hours ago', href: '/projects' },
    { id: 3, action: 'Invoice #1234 created', module: 'Finance', time: '5 hours ago', href: '/invoices' },
    { id: 4, action: 'New purchase order created', module: 'Inventory', time: '1 day ago', href: '/products' },
  ]

  return (
  <div className="p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-7xl mx-auto">

      {/* NetSuite Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 font-netsuite">
            Dashboard
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            Welcome back, {user?.name || 'User'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-netsuite-50 px-4 py-2 rounded-netsuite border border-netsuite-100">
            <span className="text-sm font-semibold text-netsuite-700">{currentCompany?.name || 'No Company'}</span>
          </div>
          <Link to="/companies/new" className="bg-netsuite-600 hover:bg-netsuite-700 text-white font-semibold py-2.5 px-6 rounded-netsuite shadow-netsuite transition-all text-sm">
            Switch Company
          </Link>
        </div>
      </div>

      {/* NetSuite KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 lg:mb-8">

        {stats.map((stat, index) => (
          <Link key={index} to={stat.href} className="group">
            <div className="bg-white hover:shadow-netsuite-lg border border-gray-200 rounded-netsuite p-6 hover:border-netsuite-200 transition-all hover:-translate-y-1 h-full">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 group-hover:text-netsuite-700 mb-2">{stat.value}</p>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-netsuite-500 to-netsuite-600 w-3/4 rounded-full shadow-inner transition-all" />
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-netsuite shadow-netsuite-lg group-hover:scale-110 transition-transform ml-4 flex-shrink-0`}>
                  <stat.icon className="text-white" size={20} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* NetSuite Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left: Charts */}
        <div className="xl:col-span-2 space-y-8">
          {/* Revenue Chart */}
          <div className="bg-white border border-gray-200 rounded-netsuite shadow-netsuite-lg p-8">
            <div className="flex items-center gap-4 mb-6 lg:mb-8">
              <div className="w-12 h-12 bg-netsuite-600 rounded-netsuite flex items-center justify-center">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Revenue Overview</h2>
                <p className="text-gray-600 font-medium">Monthly performance metrics</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#1D4ED8" />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f8fafc" />
                <XAxis dataKey="month" fontSize={14} tickLine={false} axisLine={false} tickMargin={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} tickMargin={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="url(#revenueGradient)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expenses" fill="#F87171" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Activities */}
          <div className="bg-white border border-gray-200 rounded-netsuite shadow-netsuite-lg p-8">
            <div className="flex items-center gap-4 mb-6 lg:mb-8">
              <div className="w-12 h-12 bg-orange-500 rounded-netsuite flex items-center justify-center">
                <Bell className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Recent Activities</h2>
                <p className="text-gray-600 font-medium">Latest updates across modules</p>
              </div>
            </div>

            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <Link key={activity.id} to={activity.href} className="group block p-6 border border-gray-200 rounded-netsuite hover:border-netsuite-300 hover:shadow-netsuite hover:bg-gray-50 transition-all">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-netsuite flex items-center justify-center text-white shadow-netsuite text-sm font-bold flex-shrink-0 ${activity.module === 'HR' ? 'bg-blue-500' : activity.module === 'Finance' ? 'bg-green-500' : 'bg-purple-500'}`}>
                      {activity.module.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-netsuite-600 transition-colors">{activity.action}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <span>{activity.module}</span>
                        <span>•</span>
                        <span>{activity.time}</span>
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white border border-gray-200 rounded-netsuite shadow-netsuite-lg p-8 sticky top-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
            <div className="space-y-4">
              {[
                { title: 'New Employee', desc: 'Add team member', href: '/employees/new', icon: Users, color: 'netsuite' },
                { title: 'New Invoice', desc: 'Create billing', href: '/invoices/new', icon: DollarSign, color: 'emerald' },
                { title: 'New Product', desc: 'Add inventory', href: '/products/new', icon: Package, color: 'purple' },
                { title: 'New Project', desc: 'Start project', href: '/projects/new', icon: HardHat, color: 'orange' },
              ].map((action, index) => (
                <Link key={index} to={action.href} className="group flex items-center gap-4 p-4 rounded-netsuite hover:bg-gray-50 transition-all border border-gray-200 hover:border-netsuite-200 hover:shadow-netsuite">
                  <div className={`w-12 h-12 rounded-netsuite flex items-center justify-center shadow-netsuite text-white group-hover:scale-105 transition-transform`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 group-hover:text-netsuite-600">{action.title}</p>
                    <p className="text-sm text-gray-500">{action.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

}

export default Dashboard

