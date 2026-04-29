import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Toaster } from 'react-hot-toast'

import Dashboard from './pages/Dashboard'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import MainLayout from './components/layouts/MainLayout'
import AuthLayout from './components/layouts/AuthLayout'

// HR
import EmployeeList from './pages/hr/EmployeeList'
import EmployeeForm from './pages/hr/EmployeeForm'
import DepartmentList from './pages/hr/DepartmentList'
import DepartmentForm from './pages/hr/DepartmentForm'
import RoleList from './pages/hr/RoleList'
import RoleForm from './pages/hr/RoleForm'
import KPIDashboard from './pages/hr/KPIDashboard'
import TaskBoard from './pages/hr/TaskBoard'

// Finance
import InvoiceList from './pages/finance/InvoiceList'
import InvoiceForm from './pages/finance/InvoiceForm'
import ReportsList from './pages/finance/ReportsList'
import CashManagement from './pages/finance/CashManagement'

// Companies
import CompanyList from './pages/companies/CompanyList'
import CompanyForm from './pages/companies/CompanyForm'

// Inventory
import ProductList from './pages/inventory/ProductList'
import ProductForm from './pages/inventory/ProductForm'
import StockAlerts from './pages/inventory/StockAlerts'

// Projects
import ProjectList from './pages/projects/ProjectList'
import ProjectForm from './pages/projects/ProjectForm'
import WorkOrderList from './pages/emech/WorkOrderList'
import WorkOrderForm from './pages/emech/WorkOrderForm'
import ShipmentList from './pages/imex/ShipmentList'
import ShipmentForm from './pages/imex/ShipmentForm'
import PropertyList from './pages/realestate/PropertyList'
import PropertyForm from './pages/realestate/PropertyForm'
import CustomerList from './pages/customers/CustomerList'
import CustomerForm from './pages/customers/CustomerForm'
import SupplierList from './pages/suppliers/SupplierList'
import SupplierForm from './pages/suppliers/SupplierForm'

// Chat
import ChatLayout from './pages/Chat/ChatLayout'
import AnnouncementBoard from './pages/communications/AnnouncementBoard'

// Documents
import DocumentList from './pages/documents/DocumentList'

// Contracts
import ContractList from './pages/contracts/ContractList'
import ContractForm from './pages/contracts/ContractForm'

// Recurring
import RecurringList from './pages/recurring/RecurringList'

// Warehouses
import WarehouseList from './pages/warehouses/WarehouseList'
import WarehouseForm from './pages/warehouses/WarehouseForm'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth)
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

const App = () => {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="/login" element={<Navigate to="/auth/login" replace />} />
        <Route path="/register" element={<Navigate to="/auth/register" replace />} />

        {/* Protected Routes */}
      <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* HR Routes */}
          <Route path="employees" element={<EmployeeList />} />
          <Route path="employees/new" element={<EmployeeForm />} />
          <Route path="employees/:id" element={<EmployeeForm />} />
          <Route path="departments" element={<DepartmentList />} />
          <Route path="departments/new" element={<DepartmentForm />} />
          <Route path="departments/:id/edit" element={<DepartmentForm />} />
          <Route path="roles" element={<RoleList />} />
          <Route path="roles/new" element={<RoleForm />} />
          <Route path="roles/:id" element={<RoleForm />} />
          <Route path="kpi" element={<Navigate to="/kpis" replace />} />
          <Route path="kpis" element={<KPIDashboard />} />
          <Route path="tasks" element={<TaskBoard />} />
          
          {/* Finance Routes */}
          <Route path="invoices" element={<InvoiceList />} />
          <Route path="invoices/new" element={<InvoiceForm />} />
          <Route path="invoices/:id/edit" element={<InvoiceForm />} />
          <Route path="reports" element={<ReportsList />} />
          <Route path="cash" element={<CashManagement />} />

          {/* Companies */}
          <Route path="companies" element={<CompanyList />} />
          <Route path="companies/new" element={<CompanyForm />} />
          <Route path="companies/:id" element={<CompanyForm />} />

          {/* Inventory */}
          <Route path="products" element={<ProductList />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/:id/edit" element={<ProductForm />} />
          <Route path="inventory/alerts" element={<StockAlerts />} />
          <Route path="stock-alerts" element={<StockAlerts />} />
          <Route path="warehouses" element={<WarehouseList />} />
          <Route path="warehouses/new" element={<WarehouseForm />} />
          <Route path="warehouses/:id/edit" element={<WarehouseForm />} />
          <Route path="suppliers" element={<SupplierList />} />
          <Route path="suppliers/new" element={<SupplierForm />} />
          <Route path="suppliers/:id/edit" element={<SupplierForm />} />
          <Route path="customers" element={<CustomerList />} />
          <Route path="customers/new" element={<CustomerForm />} />
          <Route path="customers/:id/edit" element={<CustomerForm />} />

          {/* Projects */}
          <Route path="projects" element={<ProjectList />} />
          <Route path="projects/new" element={<ProjectForm />} />
          <Route path="projects/:id/edit" element={<ProjectForm />} />
          <Route path="work-orders" element={<WorkOrderList />} />
          <Route path="work-orders/new" element={<WorkOrderForm />} />
          <Route path="work-orders/:id/edit" element={<WorkOrderForm />} />
          <Route path="shipments" element={<ShipmentList />} />
          <Route path="shipments/new" element={<ShipmentForm />} />
          <Route path="shipments/:id/edit" element={<ShipmentForm />} />
          <Route path="properties" element={<PropertyList />} />
          <Route path="properties/new" element={<PropertyForm />} />
          <Route path="properties/:id/edit" element={<PropertyForm />} />

          {/* Chat */}
          <Route path="chat" element={<ChatLayout />} />
          <Route path="announcements" element={<AnnouncementBoard />} />

          {/* Documents */}
          <Route path="documents" element={<DocumentList />} />

          {/* Contracts */}
          <Route path="contracts" element={<ContractList />} />
          <Route path="contracts/new" element={<ContractForm />} />
          
          {/* Recurring */}
          <Route path="recurring" element={<RecurringList />} />
        </Route>
      </Routes>
    </>
  )
}

export default App

