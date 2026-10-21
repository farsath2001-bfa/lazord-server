const Post = require('../models/Post')

const slugify = (s = '') =>
  s.toString().toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'post'

const uniqueSlug = async (base, ignoreId) => {
  let slug = base
  let n = 1
  // eslint-disable-next-line no-await-in-loop
  while (await Post.exists({ slug, ...(ignoreId ? { _id: { $ne: ignoreId } } : {}) })) {
    n += 1
    slug = `${base}-${n}`
  }
  return slug
}

// Only these fields can be written from the request body.
const pick = (body) => {
  const out = {}
  ;['title', 'titleAr', 'excerpt', 'excerptAr', 'content', 'contentAr', 'coverImage', 'category', 'author', 'published'].forEach(k => {
    if (body[k] !== undefined) out[k] = body[k]
  })
  if (Array.isArray(body.tags)) out.tags = body.tags.map(t => String(t).trim()).filter(Boolean)
  return out
}

// @route GET /api/posts   (public — published only, without full content)
const getPosts = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 100)
    const posts = await Post.find({ published: true })
      .select('-content -contentAr')
      .sort({ publishedAt: -1 })
      .limit(limit)
    res.json({ success: true, count: posts.length, data: posts })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route GET /api/posts/slug/:slug   (public — published only)
const getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug.toLowerCase(), published: true })
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' })
    res.json({ success: true, data: post })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route GET /api/posts/admin/all   (admin — drafts included)
const getAllPostsAdmin = async (req, res) => {
  try {
    const posts = await Post.find().select('-content -contentAr').sort({ updatedAt: -1 })
    res.json({ success: true, count: posts.length, data: posts })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route GET /api/posts/admin/:id   (admin — full post for editing)
const getPostAdmin = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' })
    res.json({ success: true, data: post })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// @route POST /api/posts   (admin)
const createPost = async (req, res) => {
  try {
    const data = pick(req.body)
    const base = slugify(req.body.slug || data.title)
    data.slug = await uniqueSlug(base)
    if (data.published) data.publishedAt = new Date()
    const post = await Post.create(data)
    res.status(201).json({ success: true, data: post })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// @route PUT /api/posts/:id   (admin)
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' })
    const data = pick(req.body)
    Object.assign(post, data)
    if (req.body.slug && slugify(req.body.slug) !== post.slug) {
      post.slug = await uniqueSlug(slugify(req.body.slug), post._id)
    }
    if (post.published && !post.publishedAt) post.publishedAt = new Date()
    await post.save()
    res.json({ success: true, data: post })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// @route DELETE /api/posts/:id   (admin)
const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id)
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' })
    res.json({ success: true, message: 'Post deleted' })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

module.exports = { getPosts, getPostBySlug, getAllPostsAdmin, getPostAdmin, createPost, updatePost, deletePost }
