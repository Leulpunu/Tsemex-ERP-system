import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, Building2, Users, Package, HardHat, 
  Wrench, Globe, Hotel, Truck, Home, DollarSign, Building, 
  Target, X 
} from 'lucide-react'

import { Bell } from 'lucide-react'

const menuItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/companies', label: 'Companies', icon: Building2 },
  { path: '/employees', label: 'HR', icon: Users },
  { path: '/departments', label: 'Departments', icon: Building },
  { path: '/kpis', label: 'KPIs', icon: Target },
  { path: '/customers', label: 'Customers', icon: Users },
  { path: '/suppliers', label: 'Suppliers', icon: Truck },
  { path: '/warehouses', label: 'Warehouses', icon: Home },

{ path: '/inventory/alerts', label: 'Stock Alerts', icon: Bell },
  { path: '/products', label: 'Products', icon: Package },
  { path: '/invoices', label: 'Finance', icon: DollarSign },

  { path: '/projects', label: 'Projects', icon: HardHat },
  { path: '/work-orders', label: 'E-Mechanical', icon: Wrench },
  { path: '/shipments', label: 'Import/Export', icon: Globe },
  { path: '/properties', label: 'Real Estate', icon: Hotel },
]

const MobileSidebar = ({ isOpen, onClose }) => {
  const location = useLocation()

  const isActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path))

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-gray-900 transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:hidden`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white">TSEMEX ERP</h1>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-700"
          >
            <X className="h-6 w-6 text-white" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-lg text-gray-200 hover:bg-gray-800 hover:text-white transition-all ${
                isActive(item.path) 
                  ? 'bg-blue-600 text-white border-r-4 border-blue-400 shadow-lg' 
                  : ''
              }`}
              onClick={onClose}
            >
              <item.icon className="w-5 h-5 mr-4 flex-shrink-0" />
              <span className="text-base font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}

export default MobileSidebar

