# KPI Dashboard Zero-Initialization Fix
- [x] 1. Update backend/routes/kpis.js: Add `?period=current` filter (startDate <= now <= endDate, status='active')
</new_str
- [x] 2. Update frontend/src/store/slices/kpiSlice.js: getKpis accepts/uses params (?period
- [x] 3. Update frontend/src/pages/hr/KPIDashboard.jsx: dispatch(getKpis({period: 'current'}))
- [x] 4. Restart backend/frontend: Run `start-all.bat
- [ ] 5. Test: Dashboard shows 0/empty KPIs initially
- [ ] 6. Create/update KPI, verify actualValue increments progress from 0
- [ ] 7. Check seed.js doesn't create active current-period KPIs with values

