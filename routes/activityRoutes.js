const express = require('express')
const router = express.Router()
const Activity = require('../models/Activity')
const { protect, adminOnly } = require('../middleware/authMiddleware')

// @route GET /api/activity — latest 150 entries
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const items = await Activity.find().sort({ createdAt: -1 }).limit(150)
    res.json({ success: true, count: items.length, data: items })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router
