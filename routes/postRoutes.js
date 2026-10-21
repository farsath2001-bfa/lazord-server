const express = require('express')
const router = express.Router()
const {
  getPosts,
  getPostBySlug,
  getAllPostsAdmin,
  getPostAdmin,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/postController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

// Public
router.get('/', getPosts)
router.get('/slug/:slug', getPostBySlug)

// Admin (declared before any /:id route)
router.get('/admin/all', protect, adminOnly, getAllPostsAdmin)
router.get('/admin/:id', protect, adminOnly, getPostAdmin)
router.post('/', protect, adminOnly, createPost)
router.put('/:id', protect, adminOnly, updatePost)
router.delete('/:id', protect, adminOnly, deletePost)

module.exports = router
