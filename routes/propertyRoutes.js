const express = require('express')
const router = express.Router()
const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  bulkUpdateProperties,
  bulkDeleteProperties
} = require('../controllers/propertyController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

// Public routes
router.get('/',    getProperties)
router.get('/:id', getPropertyById)

// Private routes (Admin only)
router.put('/bulk',         protect, adminOnly, bulkUpdateProperties)
router.post('/bulk-delete', protect, adminOnly, bulkDeleteProperties)
router.post('/',    protect, adminOnly, createProperty)
router.put('/:id',  protect, adminOnly, updateProperty)
router.delete('/:id', protect, adminOnly, deleteProperty)

module.exports = router