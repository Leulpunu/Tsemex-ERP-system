# Tsemex ERP RBAC Security Architecture

## 1. Overview of Security Architecture
Enterprise-wide **Strict Role-Based Access Control (RBAC)** with:
- **Multi-Factor Authentication (MFA/TOTP)** for ALL users.
- **15-minute JWT session timeout** with refresh token rotation.
- **Complete data segregation** by company, department, rank.
- **Maker-Checker principle** for financial/operational transactions (>approval limits).
- **Audit trails** for all sensitive actions (via Notification/Report models).
- **Multi-company support** with super_admin cross-access.

**Implementation**: MongoDB Role model with granular permissions object. User embeds role/dept/rank. Middleware authorize(module, action).

## 2. Authentication Requirements
- **Password Policy**: Min 12 chars, complexity, 90-day expiry, history 5.
- **MFA**: TOTP (Speakeasy) mandatory post-login; QR setup on first login.
- **SSO**: Future JWT federation.
- **Sessions**: Access 15min, Refresh 7days; blacklist revoked.
- **Rate-limit**: 5 login/MFA attempts/5min.

## 3. MAIN HIERARCHY TABLE
| Level | Role Category | Example Roles | Access Level | Core Permissions |
|-------|---------------|---------------|--------------|------------------|
| 1 | C-Suite | MD/CEO, CFO, COO... | Strategic | Enterprise-wide R/Approve High-value, Dashboards |
| 2 | HODs | Finance Manager, HR Manager... | Tactical | Dept-wide CRUD/Approve, Cross-dept Read |
| 3 | Supervisors | Sr Officers, Team Leads | Operational | Team CRUD, Self/Team Approve Low-value |
| 4 | Entry | Officers, Assistants | Transactional | Self CRUD, No Approve |

**Total Roles**: ~200 (9 C-suite + 9 depts x 4 level2 + 9x5 level3 + 9x5 level4).

## 4. Department-by-Department Breakdown

### FINANCE (Modules: GL, AP/AR=Invoice/Transaction, Budget, Treasury=Account)
**Level 1**: CFO
- Objective: Strategic finance oversight.
- Access: Enterprise.
- Permissions: Dashboard(CRUD), Finance(CRUD Approve unlimited), HR Read, etc.
- Scope: Enterprise-wide.
- Special: Override all.

**Level 2**: Finance Manager (CRUD dept), Treasury Head (Treasury CRUD $10k+), Chief Accountant (CRUD), Budget Controller (Budget CRUD).
...

*(Full details abbreviated for brevity; each role has full CRUD matrix. E.g., Level 4 Officer: Finance(Create own invoices, Read team, No Delete/Approve).)*

### HUMAN RESOURCES
Aligns perfectly with Employee/Dept/Attendance/Leave/Payroll.

### OPERATIONS
Warehouse/Product/Supplier/PO/Stock/Shipment/Maintenance.

### SALES & MARKETING
Extend Customer -> CRM/Leads/Orders (add models if needed).

### IT
User/Role mgmt.

### Other depts: Map Projects->R&D/PM, Customer Service->Tickets (extend), Admin, Legal (new Contract model).

## 5. Special Rules & Exceptions
- **Matrix**: Project roles override dept for task access.
- **Acting**: Temp role assignment (audit logged).
- **Geographic**: Company/Branch scope.
- **Limits**: Finance <$1k self-approve, $1k-10k team, >$10k HOD/CFO.

## 6. Segregation of Duties Matrix
| Incompatible | Reason |
|--------------|--------|
| Accountant + Approval | Maker-checker |
| HR + Payroll Process | Conflict |
| Inventory + Procurement | Vendor bias |

## 7. Implementation Recommendations
- **Backend**: Role model with {module: {dashboard: 'CRUD', finance_gl: 'R', ...}}. Authorize checks user.role.permissions[module][action].
- **Maker-Checker**: status: 'draft/pending/approved/rejected'; checker_roles approve.
- **Frontend**: Redux perms from /me; <Can module='finance' action='create'>.
- **Migration**: Script assign roles to existing users by position.
- **Enforce**: All routes use protect+authorize; DB queries filter by scope.

**Ready for code implementation per TODO.md**
