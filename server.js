const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

// Load env variables
dotenv.config()

const app = express()

// Render sits behind a proxy; needed so rate limiting sees the real visitor IP
app.set('trust proxy', 1)
// Security headers (images are served to the Vercel site, so allow cross-origin loads)
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))

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

// Rate limits: generous for normal browsing, strict for login and public enquiry forms
const limiter = (limit) => rateLimit({ windowMs: 15 * 60 * 1000, limit, standardHeaders: true, legacyHeaders: false, message: { success: false, message: 'Too many requests, please try again later' } })
app.use('/api', limiter(600))
app.use('/api/auth/login', limiter(10))
app.post('/api/leads', limiter(20))

// Static folder for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/properties', require('./routes/propertyRoutes'))
app.use('/api/auth',       require('./routes/authRoutes'))
app.use('/api/leads',      require('./routes/leadRoutes'))
app.use('/api/posts',      require('./routes/postRoutes'))
app.use('/api/agents',     require('./routes/agentRoutes'))
app.use('/api/activity',   require('./routes/activityRoutes'))
app.use('/api/reports',    require('./routes/reportRoutes'))
app.use('/api/upload',     require('./routes/uploadRoutes'))

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