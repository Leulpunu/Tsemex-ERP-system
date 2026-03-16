import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import MainLayout from './components/layouts/MainLayout'
import AuthLayout from './components/layouts/AuthLayout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/Dashboard'
import CompanyList from './pages/companies/CompanyList'
import CompanyForm from './pages/companies/CompanyForm'
import EmployeeList from './pages/hr/EmployeeList'
import EmployeeForm from './pages/hr/EmployeeForm'
import DepartmentList from './pages/hr/DepartmentList'
import InvoiceList from './pages/finance/InvoiceList'
import ProductList from './pages/inventory/ProductList'
import ProjectList from './pages/projects/ProjectList'
import WorkOrderList from './pages/emech/WorkOrderList'
import ShipmentList from './pages/imex/ShipmentList'
import PropertyList from './pages/realestate/PropertyList'
import CustomerList from './pages/customers/CustomerList'
import CustomerForm from './pages/customers/CustomerForm'
import SupplierList from './pages/suppliers/SupplierList'
import SupplierForm from './pages/suppliers/SupplierForm'
import WarehouseList from './pages/warehouses/WarehouseList'

function App() {
  const { user } = useSelector((state) => state.auth)

  return (
    <Routes>
      <Route path="/auth" element={!user ? <AuthLayout /> : <Navigate to="/" />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      <Route path="/" element={user ? <MainLayout /> : <Navigate to="/auth/login" />}>
        <Route index element={<Dashboard />} />
        <Route path="companies" element={<CompanyList />} />
        <Route path="companies/new" element={<CompanyForm />} />
        <Route path="companies/:id/edit" element={<CompanyForm />} />
        <Route path="employees" element={<EmployeeList />} />
        <Route path="employees/new" element={<EmployeeForm />} />
        <Route path="employees/:id/edit" element={<EmployeeForm />} />
        <Route path="departments" element={<DepartmentList />} />
        <Route path="invoices" element={<InvoiceList />} />
        <Route path="products" element={<ProductList />} />
        <Route path="projects" element={<ProjectList />} />
        <Route path="work-orders" element={<WorkOrderList />} />
        <Route path="shipments" element={<ShipmentList />} />
        <Route path="properties" element={<PropertyList />} />
        <Route path="customers" element={<CustomerList />} />
        <Route path="customers/new" element={<CustomerForm />} />
        <Route path="customers/:id/edit" element={<CustomerForm />} />
        <Route path="suppliers" element={<SupplierList />} />
        <Route path="suppliers/new" element={<SupplierForm />} />
        <Route path="suppliers/:id/edit" element={<SupplierForm />} />
        <Route path="warehouses" element={<WarehouseList />} />
      </Route>
    </Routes>
  )
}

export default App
