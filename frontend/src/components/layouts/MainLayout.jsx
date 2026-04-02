import { useState } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../store/slices/authSlice'
import { 
  LayoutDashboard, Building2, Users, Package, HardHat, 
  Wrench, Globe, Hotel, Truck, Home, DollarSign, Building, 
  Target, Menu, ChevronDown, Bell, MessageCircle, FileText 
} from 'lucide-react'

import MobileSidebar from '../MobileSidebar'
import ChatSidebar from '../Chat/ChatSidebar'

const MainLayout = () => {
  const [companyDropdown, setCompanyDropdown] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const location = useLocation()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { currentCompany } = useSelector((state) => state.company)

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/companies', label: 'Companies', icon: Building2 },
    { path: '/employees', label: 'Employees', icon: Users },
    { path: '/departments', label: 'Departments', icon: Building },
    { path: '/kpis', label: 'Performance', icon: Target },
    { path: '/documents', label: 'Documents', icon: FileText },
    { path: '/customers', label: 'Customers', icon: Users },
    { path: '/suppliers', label: 'Suppliers', icon: Truck },
    { path: '/warehouses', label: 'Warehouses', icon: Home },
    { path: '/inventory/alerts', label: 'Alerts', icon: Bell },
    { path: '/products', label: 'Inventory', icon: Package },
    { path: '/invoices', label: 'Invoices', icon: DollarSign },
    { path: '/projects', label: 'Projects', icon: HardHat },
    { path: '/work-orders', label: 'Work Orders', icon: Wrench },
    { path: '/shipments', label: 'Shipments', icon: Globe },
    { path: '/properties', label: 'Properties', icon: Hotel },
  ]

  const isActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path))

  return (
    <div className="min-h-screen flex font-netsuite bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 xl:w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex-shrink-0">
        <div className="h-screen flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <img 
                  src="/logo.png" 
                  alt="Tsemex" 
                  className="h-20 w-20 object-contain"
                />
                <div>
                  <h1 className="text-xl font-bold">Tsemex ERP</h1>
                  <p className="text-xs opacity-75">Enterprise Edition</p>
                </div>
              </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg text-gray-200 hover:bg-gray-700 hover:text-white transition-all group ${isActive(item.path) ? 'bg-blue-600 text-white shadow-lg border-r-4 border-blue-400' : ''}`}
              >
                <item.icon className="w-5 h-5 mr-3 flex-shrink-0 opacity-80 group-hover:opacity-100" />
                <span className="font-medium text-sm tracking-tight truncate">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700 space-y-2 mt-auto">
            <button 
              onClick={() => dispatch(logout())}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2.5 px-3 rounded-lg border border-gray-600 transition-all text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && <MobileSidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />}

      {/* Chat Overlay */}
      {isChatOpen && <ChatSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />}

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              {/* Left: Mobile Menu + Company */}
              <div className="flex items-center space-x-3">
                <button 
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-50"
                  onClick={() => setIsMobileSidebarOpen(true)}
                >
                  <Menu className="h-6 w-6 text-gray-700" />
                </button>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-sm text-gray-900 hidden sm:inline">
                    {currentCompany?.name || 'Tsemex Global'}
                  </span>
                </div>
              </div>

              {/* Search */}
              <div className="flex-1 max-w-md mx-4 hidden md:block">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="search"
                    placeholder="Global search..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm hover:shadow-md transition-all"
                  />
                </div>
              </div>

              {/* Right: Notifications, Chat, Profile */}
              <div className="flex items-center space-x-3">
                <button className="p-2 rounded-lg hover:bg-gray-50 relative">
                  <Bell className="h-6 w-6 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">3</span>
                </button>
                <button 
                  className="p-2 rounded-lg hover:bg-gray-50"
                  onClick={() => setIsChatOpen(true)}
                >
                  <MessageCircle className="h-6 w-6 text-gray-600" />
                </button>
                <div className="flex items-center space-x-2">
                  <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-semibold shadow-md">
                    {user?.name?.[0] || 'U'}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{user?.role || 'Admin'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-gray-50 to-white max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout

