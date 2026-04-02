# KPI Dashboard Fix TODO

## Steps from approved plan

- [x] 1. Add kpiReducer to frontend/src/store/index.js
- [x] 2. Add /kpis route + import to frontend/src/App.jsx
- [x] 3. Fix useSelector in frontend/src/pages/hr/KPIDashboard.jsx for departments from state.departments
- [x] 4. Execute backend seed data (seed-complete.js) - basic auth/company seeded (admin@tsemex.com/admin123)
- [ ] 5. Create departments via app for KPI data
- [x] 6. Verify KPI page loads (functional, shows 0 KPIs initially)

**Notes:** 
- Login, /companies, /departments/new → add data.
- MongoDB URI note for seed fixed by backend running.
- Page no longer blank/white! [KPI complete](http://localhost:5173/kpis)

