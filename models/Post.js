const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  title:     { type: String, required: [true, 'Title is required'], trim: true },
  titleAr:   { type: String, trim: true },
  slug:      { type: String, required: true, unique: true, lowercase: true, trim: true },
  excerpt:   { type: String, trim: true },
  excerptAr: { type: String, trim: true },
  // Plain text with light markdown: ## heading, ### sub-heading, - bullets, > quote, **bold**, [text](https://link)
  content:   { type: String, required: [true, 'Content is required'] },
  contentAr: { type: String },
  coverImage: { type: String, trim: true },
  category:  { type: String, trim: true, default: 'Market Insights' },
  tags:      [{ type: String, trim: true }],
  author:    { type: String, trim: true, default: 'Lazord Real Estate' },
  published: { type: Boolean, default: false },
  publishedAt: { type: Date }
}, { timestamps: true })

postSchema.index({ published: 1, publishedAt: -1 })

module.exports = mongoose.model('Post', postSchema)
