const express = require('express')
const router = express.Router()
const {
  createLead,
  getLeads,
  updateLead,
  deleteLead
} = require('../controllers/leadController')
const { protect, adminOnly, staff } = require('../middleware/authMiddleware')

// Public — anyone can submit inquiry
router.post('/', createLead)

// Private — admin only
router.get('/',     protect, staff, getLeads)
router.put('/:id',  protect, staff, updateLead)
router.delete('/:id', protect, adminOnly, deleteLead)

module.exports = router