import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import companyReducer from './slices/companySlice'
import kpiReducer from './slices/kpiSlice'
import reportReducer from './slices/reportSlice'
import cashReducer from './slices/cashSlice'
import contractReducer from './slices/contractSlice'
import { chatApi } from './slices/chatSlice'

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
import documentReducer from './slices/documentSlice'
import { stockAlertApi } from './slices/stockAlertSlice'
import taskReducer from './slices/taskSlice'
import announcementReducer from './slices/announcementSlice'


export const store = configureStore({
  reducer: {
    auth: authReducer,
    company: companyReducer,
    kpis: kpiReducer,
    documents: documentReducer,
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
    tasks: taskReducer,
    announcements: announcementReducer,
    reports: reportReducer,
    cash: cashReducer,
    contracts: contractReducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [stockAlertApi.reducerPath]: stockAlertApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(chatApi.middleware, stockAlertApi.middleware),
})



