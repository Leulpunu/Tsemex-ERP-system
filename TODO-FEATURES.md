# Tsemex ERP Feature Implementation Steps

## 1. Inventory Stock Alert System
- [x] Create backend/models/StockAlert.js
- [x] Create backend/routes/stockAlerts.js (GET alerts, POST resolve)

- [x] Update backend/routes/products.js (add lowStock flag)

- [x] Update frontend/src/pages/inventory/StockAlerts.jsx

- [x] Add frontend/src/store/slices/stockAlertSlice.js

- [x] Add link in ProductList.jsx and MainLayout nav


## 2. User Role Management
- [x] Create backend/routes/roles.js (CRUD roles, assign to users)
- [x] Update frontend/src/pages/hr/RoleList.jsx and RoleForm.jsx
- [x] Update frontend/src/pages/hr/EmployeeForm.jsx (role dropdown)

- [x] Add frontend/src/store/slices/roleSlice.js
- [x] Add nav link in HR section


## 3. Complete Chat Features (Phase 4)
- [ ] Update backend/routes/chat.js (typing indicators)
- [ ] Update frontend/src/components/Chat/ChatWindow.jsx (typing, read receipts)
- [ ] Update frontend/src/store/slices/chatSlice.js

## Testing
- [ ] npm run install-all
- [ ] .\start-all.bat
- [ ] Test alerts, role assignment, chat

Progress tracked here.

