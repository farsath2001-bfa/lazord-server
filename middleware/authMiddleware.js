const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async (req, res, next) => {
  try {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-password')

    if (!req.user || req.user.isActive === false) {
      return res.status(401).json({ success: false, message: 'Not authorized, account unavailable' })
    }
    next()

  } catch (error) {
    res.status(401).json({ success: false, message: 'Not authorized, token failed' })
  }
}

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    res.status(403).json({ success: false, message: 'Admin access required' })
  }
}

// Admins and agents (use after protect)
const staff = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'agent')) {
    next()
  } else {
    res.status(403).json({ success: false, message: 'Staff access required' })
  }
}

// Registration is open only while there are no users at all (first admin setup).
// After that, only a logged-in admin can create accounts.
const registerGuard = async (req, res, next) => {
  try {
    const count = await User.countDocuments()
    if (count === 0) {
      req.body.role = 'admin'
      return next()
    }
    return protect(req, res, () => adminOnly(req, res, next))
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = { protect, adminOnly, staff, registerGuard }
