# User-to-User Chat + AI Agent Integration
Status: 🚀 Ready

## Core Plan (ROCKS Method)
**Role** - User department/role
**Objective** - What to accomplish
**Context** - ERP module 
**Key Data** - Filters/params
**Structure** - Response format

## 1. Backend Chat API [✅ Exists]
- backend/models/ChatRoom.js ✓
- backend/models/Message.js ✓
- backend/routes/chat.js ✓

## 2. Frontend Chat UI [✅ Exists]
- ChatSidebar.jsx ✓
- ChatWindow.jsx ✓
- chatSlice.js ✓

## 3. AI Agent Prompts (Per Dept)
```
Finance: Overdue collections, invoices due, cash flow
HR: PTO balance, team availability, onboarding
Inventory: Stock levels, reorder alerts
Projects: Task status, resource allocation
```

## 4. Integration Steps
1. **✅** Chat overlay toggle (MainLayout)
2. **Next:** AI command parser (`/companies low-stock`)
3. Real-time Socket.io messages
4. ERP data context injection

## 5. Test
```
1. Login admin@tsemex.com/admin123
2. Toggle chat sidebar
3. `/help` → AI prompt library
4. `/companies` → Company list
```

**Run:** `npm run dev` → Chat active!

