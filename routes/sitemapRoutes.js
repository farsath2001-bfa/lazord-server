const express = require('express')
const router = express.Router()
const Property = require('../models/Property')
const Post = require('../models/Post')

const SITE = (process.env.SITE_URL || 'https://lazord-ui.vercel.app').replace(/\/$/, '')

const STATIC = [
  '/', '/properties', '/properties?type=Buy', '/properties?type=Rent', '/properties?type=Off%20Plan',
  '/areas', '/areas/downtown', '/areas/marina', '/areas/palm', '/areas/business-bay', '/areas/creek-harbour', '/areas/jvc',
  '/investment-tools', '/mortgage-calculator', '/blog', '/about', '/agents', '/contact', '/faq', '/newsletter', '/legal'
]

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const day = (d) => (d ? new Date(d).toISOString().slice(0, 10) : null)
const url = (loc, lastmod) => `  <url><loc>${esc(SITE + loc)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`

// @route GET /api/sitemap.xml — static pages + every available listing + published articles
router.get('/sitemap.xml', async (req, res) => {
  try {
    const [props, posts] = await Promise.all([
      Property.find({ status: { $ne: 'Sold' } }).select('_id updatedAt').lean(),
      Post.find({ published: true }).select('slug updatedAt').lean()
    ])
    const lines = [
      ...STATIC.map(p => url(p)),
      ...props.map(p => url(`/properties/${p._id}`, day(p.updatedAt))),
      ...posts.map(p => url(`/blog/${encodeURIComponent(p.slug)}`, day(p.updatedAt)))
    ]
    res.set('Content-Type', 'application/xml; charset=utf-8')
    res.set('Cache-Control', 'public, max-age=3600')
    res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${lines.join('\n')}\n</urlset>\n`)
  } catch (error) {
    res.status(500).send('sitemap unavailable')
  }
})

module.exports = router
