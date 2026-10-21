const mongoose = require('mongoose')

// Short audit trail of admin actions. Entries expire after 90 days.
const activitySchema = new mongoose.Schema({
  action: { type: String, required: true },   // created | updated | deleted | received | bulk-updated | bulk-deleted
  entity: { type: String, required: true },   // property | lead
  label: { type: String, default: '' },
  user: { type: String, default: 'System' },
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 90 }
})

module.exports = mongoose.model('Activity', activitySchema)
