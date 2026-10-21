const mongoose = require('mongoose')

const agentSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true },
  title: { type: String, trim: true, default: '' },
  experience: { type: String, trim: true, default: '' },
  phone: { type: String, required: [true, 'Phone is required'], trim: true },
  whatsapp: { type: String, trim: true, default: '' },
  email: { type: String, trim: true, lowercase: true, default: '' },
  photo: { type: String, trim: true, default: '' },
  languages: { type: String, trim: true, default: '' },
  speciality: { type: String, trim: true, default: '' },
  areas: [{ type: String, trim: true }],
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
}, { timestamps: true })

module.exports = mongoose.model('Agent', agentSchema)
