const express = require('express')
const crypto = require('crypto')
const router = express.Router()
const { protect, adminOnly } = require('../middleware/authMiddleware')

const FOLDERS = ['lazord/properties', 'lazord/blog', 'lazord/agents']

// @route GET /api/upload/sign?folder=lazord/properties
// Returns a short-lived signature so the admin panel can upload photos straight to Cloudinary.
// The API secret never leaves the server. Needs CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.
router.get('/sign', protect, adminOnly, (req, res) => {
  const { CLOUDINARY_CLOUD_NAME: cloudName, CLOUDINARY_API_KEY: apiKey, CLOUDINARY_API_SECRET: secret } = process.env
  if (!cloudName || !apiKey || !secret) {
    return res.status(503).json({ success: false, message: 'Image upload is not set up on the server yet (Cloudinary keys missing)' })
  }
  const folder = FOLDERS.includes(req.query.folder) ? req.query.folder : FOLDERS[0]
  const timestamp = Math.round(Date.now() / 1000)
  const signature = crypto.createHash('sha1').update(`folder=${folder}&timestamp=${timestamp}${secret}`).digest('hex')
  res.json({ success: true, data: { cloudName, apiKey, timestamp, folder, signature } })
})

module.exports = router
