import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import companyReducer from './slices/companySlice'
import employeeReducer from './slices/employeeSlice'
import departmentReducer from './slices/departmentSlice'
import customerReducer from './slices/customerSlice'
import supplierReducer from './slices/supplierSlice'
import warehouseReducer from './slices/warehouseSlice'
import productReducer from './slices/productSlice'
import invoiceReducer from './slices/invoiceSlice'
import projectReducer from './slices/projectSlice'
import workOrderReducer from './slices/workOrderSlice'
import shipmentReducer from './slices/shipmentSlice'
import propertyReducer from './slices/propertySlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    company: companyReducer,
    employees: employeeReducer,
    departments: departmentReducer,
    customers: customerReducer,
    suppliers: supplierReducer,
    warehouses: warehouseReducer,
    products: productReducer,
    invoices: invoiceReducer,
    projects: projectReducer,
    workOrders: workOrderReducer,
    shipments: shipmentReducer,
    properties: propertyReducer,
  },
})
