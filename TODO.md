# Tsemex ERP RBAC Integration TODO

## Plan Steps:

1. ✅ Create `docs/rbac-security-architecture.md` with full hierarchy, permissions matrix from prompt, tailored to project modules.

2. ✅ Create `backend/models/Role.js` model for detailed RBAC.

3. ✅ Update models: `User.js` (add dept/rank/MFA/permissions), `Employee.js` (sync role), `Department.js` (add dept type enum).

4. ✅ Install MFA deps: speakeasy, qrcode, otplib.

5. Enhance `backend/middleware/auth.js`: granular `authorize(module, action)`, MFA verification, 15min sessions w/refresh.

4. Install MFA deps: `cd backend && npm i speakeasy qrcode otplib`.

5. Enhance `backend/middleware/auth.js`: granular `authorize(module, action)`, MFA verification, 15min sessions w/refresh.

6. Update `backend/routes/auth.js`: MFA setup/verify in login flow.

7. Refactor routes: Replace hardcoded authorize() with granular; add maker-checker fields to models like Invoice.

8. Frontend utils: `frontend/src/utils/permissions.js`; update `authSlice.js` to fetch perms.

9. Frontend guards: Update `App.jsx`, `MainLayout.jsx` for role/perm-based routing/UI.

10. Seeding: Update `backend/seed.js` with all roles; create migration script.

11. Testing: Add tests, verify MFA/session/denials; audit logs.

12. Completion: Update all routes iteratively, docs.

**Progress: 5/12**

6. ✅ Update `backend/routes/auth.js`: MFA setup/verify in login flow.

7. Refactor routes: Replace hardcoded authorize() with granular; add maker-checker fields to models like Invoice.


4. Install MFA deps: `cd backend && npm i speakeasy qrcode otplib`.

5. Enhance `backend/middleware/auth.js`: granular `authorize(module, action)`, MFA verification, 15min sessions w/refresh.

6. Update `backend/routes/auth.js`: MFA setup/verify in login flow.

7. Refactor routes: Replace hardcoded authorize() with granular; add maker-checker fields to models like Invoice.

8. Frontend utils: `frontend/src/utils/permissions.js`; update `authSlice.js` to fetch perms.

9. Frontend guards: Update `App.jsx`, `MainLayout.jsx` for role/perm-based routing/UI.

10. Seeding: Update `backend/seed.js` with all roles; create migration script.

11. Testing: Add tests, verify MFA/session/denials; audit logs.

12. Completion: Update all routes iteratively, docs.

**Progress: 0/12**
