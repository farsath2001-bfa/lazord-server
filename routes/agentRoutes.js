const express = require('express')
const router = express.Router()
const {
  getAgents,
  getAllAgentsAdmin,
  createAgent,
  updateAgent,
  deleteAgent
} = require('../controllers/agentController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

// Public
router.get('/', getAgents)

// Admin
router.get('/admin/all', protect, adminOnly, getAllAgentsAdmin)
router.post('/',         protect, adminOnly, createAgent)
router.put('/:id',       protect, adminOnly, updateAgent)
router.delete('/:id',    protect, adminOnly, deleteAgent)

module.exports = router
