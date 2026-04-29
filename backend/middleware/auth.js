const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const { verifyMFAToken } = require('../utils/mfa');

// Generic permission helper based on Role.permissions template
// moduleKey: 'finance', 'hr', 'sales', etc.
// areaKey:   e.g. 'ledger', 'payable', 'receivable', 'reporting'
// actionKey: one of 'c','r','u','d','a' (create, read, update, delete, approve)
const hasModulePermission = (user, moduleKey, areaKey, actionKey) => {
  if (!user) return false;

  // Super admin shortcut
  if (user.role === 'super_admin') return true;

  const perms =
    (user.roleId && user.roleId.permissions) ||
    user.permissions || // fallback if permissions also stored on user
    {};

  const modulePerm = perms[moduleKey];
  if (!modulePerm) return false;

  const areaPerm = modulePerm[areaKey];
  if (!areaPerm) return false;

  if (typeof areaPerm[actionKey] !== 'boolean') return false;
  return areaPerm[actionKey] === true;
};

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password').populate('roleId', 'permissions dataScope approvalLimit');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      if (!req.user.isActive || !req.user.sessionActive) {
        return res.status(401).json({ message: 'User account is deactivated' });
      }

      // MFA check — only required for sensitive mutating operations, not for GET/read
      if (req.originalUrl !== '/api/auth/refresh' && req.user.mfaSecret && !req.headers['x-mfa-token']) {
        return res.status(401).json({ message: 'MFA token required' });
      }
      if (req.headers['x-mfa-token'] && req.user.mfaSecret) {
        const valid = verifyMFAToken(req.user.mfaSecret, req.headers['x-mfa-token']);
        if (!valid) {
          return res.status(401).json({ message: 'Invalid MFA token' });
        }
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (roles.length === 0 || roles.includes(req.user?.role)) {
      next();
    } else {
      return res.status(403).json({ 
        message: `User role '${req.user?.role || 'unauthenticated'}' is not authorized to access this route` 
      });
    }
  };
};

// Backward compat
const authorizeRoles = (...roles) => authorize(null, null) || ((req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: `Role not authorized` });
  }
  next();
});

const companyAccess = (req, res, next) => {
  // Super admin can access all companies
  if (req.user.role === 'super_admin') {
    return next();
  }

  // Check if user has access to the requested company
  if (req.params.companyId && req.user.companyId) {
    if (req.params.companyId !== req.user.companyId.toString()) {
      return res.status(403).json({ message: 'Access denied to this company' });
    }
  }

  next();
};

module.exports = { protect, authorize, companyAccess, hasModulePermission };

