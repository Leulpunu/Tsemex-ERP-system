import { useState } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../store/slices/authSlice'
import { 
  LayoutDashboard, Building2, Users, Package, HardHat, 
  Wrench, Globe, Hotel, Truck, Home, DollarSign, Building, 
  Menu, X, Bell, ChevronDown
} from 'lucide-react'

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [companyDropdown, setCompanyDropdown] = useState(false)
  const location = useLocation()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { currentCompany } = useSelector((state) => state.company)

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/companies', label: 'Companies', icon: Building2 },
    { path: '/employees', label: 'HR', icon: Users },
    { path: '/departments', label: 'Departments', icon: Building },
    { path: '/customers', label: 'Customers', icon: Users },
    { path: '/suppliers', label: 'Suppliers', icon: Truck },
    { path: '/warehouses', label: 'Warehouses', icon: Home },
    { path: '/products', label: 'Products', icon: Package },
    { path: '/invoices', label: 'Finance', icon: DollarSign },
    { path: '/projects', label: 'Projects', icon: HardHat },
    { path: '/work-orders', label: 'E-Mechanical', icon: Wrench },
    { path: '/shipments', label: 'Import/Export', icon: Globe },
    { path: '/properties', label: 'Real Estate', icon: Hotel },
  ]

  const isActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path))

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          {sidebarOpen && <h1 className="text-xl font-bold">TSEMEX ERP</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-800 rounded">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-800 ${isActive(item.path) ? 'bg-gray-800 border-l-4 border-blue-500' : ''}`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button 
            onClick={() => dispatch(logout())}
            className="w-full py-2 bg-red-600 hover:bg-red-700 rounded text-sm"
          >
            {sidebarOpen ? 'Logout' : 'OUT'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {menuItems.find(item => isActive(item.path))?.label || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Company Switcher */}
            <div className="relative">
              <button 
                onClick={() => setCompanyDropdown(!companyDropdown)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <Building2 size={18} />
                <span className="text-sm">{currentCompany?.name || 'Select Company'}</span>
                <ChevronDown size={16} />
              </button>
              {companyDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <Link to="/companies" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                    Manage Companies
                  </Link>
                </div>
              )}
            </div>

            {/* Notifications */}
            <button className="p-2 hover:bg-gray-100 rounded-full relative">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Info */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="text-sm text-gray-700">{user?.name || 'User'}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout
