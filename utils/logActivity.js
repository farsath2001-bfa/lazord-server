const Activity = require('../models/Activity')

// Fire-and-forget: logging must never break the request that triggered it.
const logActivity = (req, action, entity, label) => {
  const user = req && req.user ? (req.user.name || req.user.email) : 'Website visitor'
  Activity.create({ action, entity, label: String(label || '').slice(0, 200), user }).catch(() => {})
}

module.exports = logActivity
