const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')

// Load env variables
dotenv.config()

const app = express()

// Middleware
// CLIENT_URL may hold several comma-separated origins. Local dev (5173) and
// `vite preview` (4173) are always allowed so a local build can reach the API.
const allowedOrigins = [
  ...(process.env.CLIENT_URL || '').split(',').map(o => o.trim().replace(/\/$/, '')).filter(Boolean),
  'http://localhost:5173',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:4173',
]
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
    return cb(null, false)
  },
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static folder for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/properties', require('./routes/propertyRoutes'))
app.use('/api/auth',       require('./routes/authRoutes'))
app.use('/api/leads',      require('./routes/leadRoutes'))
app.use('/api/posts',      require('./routes/postRoutes'))
app.use('/api/agents',     require('./routes/agentRoutes'))

// Health check
app.get('/', (req, res) => {
  res.json({ message: '✅ Lazord Real Estate API is running', status: 'OK' })
})

// ── Keep Render free tier awake (ping every 14 minutes) ──
const BACKEND_URL = process.env.RENDER_URL || 'https://lazord-server.onrender.com'
setInterval(() => {
  fetch(BACKEND_URL)
    .then(() => console.log('✅ Keep-alive ping sent'))
    .catch(err => console.log('⚠️ Keep-alive ping failed:', err.message))
}, 14 * 60 * 1000)

// MongoDB connection + Start server
const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected')
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message)
    process.exit(1)
  })