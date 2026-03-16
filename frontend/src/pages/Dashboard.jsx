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
    { label: 'Total Employees', value: '124', icon: Users, color: 'bg-blue-500' },
    { label: 'Active Projects', value: '12', icon: HardHat, color: 'bg-green-500' },
    { label: 'Total Revenue', value: '$2.4M', icon: DollarSign, color: 'bg-yellow-500' },
    { label: 'Pending Invoices', value: '28', icon: FileText, color: 'bg-purple-500' },
    { label: 'Stock Items', value: '1,245', icon: Package, color: 'bg-indigo-500' },
    { label: 'Notifications', value: '3', icon: Bell, color: 'bg-orange-500' },
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
    { id: 1, action: 'New employee added', module: 'HR', time: '2 hours ago' },
    { id: 2, action: 'Project "Tower A" updated', module: 'Projects', time: '4 hours ago' },
    { id: 3, action: 'Invoice #1234 created', module: 'Finance', time: '5 hours ago' },
    { id: 4, action: 'New purchase order created', module: 'Inventory', time: '1 day ago' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, {user?.name}
        </h1>
        <p className="text-gray-500">
          {currentCompany ? currentCompany.name : 'Select a company to get started'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 size={24} className="text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Revenue Overview</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#3B82F6" name="Revenue" />
              <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-gray-800">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.module}</p>
                </div>
                <span className="text-sm text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/employees/new" className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Add New Employee</h3>
          <p className="text-blue-100 text-sm mb-4">Register a new team member</p>
          <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50">
            Go to HR
          </button>
        </Link>
        <Link to="/projects" className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Create New Project</h3>
          <p className="text-green-100 text-sm mb-4">Start a new construction project</p>
          <button className="bg-white text-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50">
            Go to Projects
          </button>
        </Link>
        <Link to="/invoices" className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Create Invoice</h3>
          <p className="text-purple-100 text-sm mb-4">Generate a new invoice</p>
          <button className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-50">
            Go to Finance
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Dashboard
