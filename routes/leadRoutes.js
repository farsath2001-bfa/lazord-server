const express = require('express')
const router = express.Router()
const {
  createLead,
  getLeads,
  updateLead,
  deleteLead
} = require('../controllers/leadController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

// Public — anyone can submit inquiry
router.post('/', createLead)

// Private — admin only
router.get('/',     protect, adminOnly, getLeads)
router.put('/:id',  protect, adminOnly, updateLead)
router.delete('/:id', protect, adminOnly, deleteLead)

module.exports = router