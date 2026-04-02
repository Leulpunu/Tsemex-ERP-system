# Chat Toggle Overlay Plan

**Problem:** Fixed ChatSidebar (lg:w-80) blocks main content

**Solution:** Click-to-open overlay/modal

**Files to modify:**
1. MainLayout.jsx - Add `isChatOpen` state + toggle button in header
2. ChatSidebar.jsx - Accept `isOpen`, `onClose` props + overlay styling (fixed z-50 right-0 backdrop)
3. Responsive: Mobile full-screen

**Implementation steps:**
1. MainLayout: `[isChatOpen, setIsChatOpen]`, MessageCircle button in header
2. Conditional render: `isChatOpen && <ChatSidebar isOpen onClose={() => setIsChatOpen(false)} />`
3. ChatSidebar: fixed inset-y-0 right-0 w-96 lg:w-80 translate-x-full transition, backdrop
4. Close on overlay click

**Approve to proceed → Create implementation plan + code changes**

