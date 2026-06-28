const mongoose = require('mongoose')

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true
  },
  service: {
    type: String,
    enum: ['Buy a Property', 'Rent a Property', 'Sell My Property', 'Off Plan Investment', 'Commercial Property', 'Free Valuation', 'General Inquiry'],
    default: 'General Inquiry'
  },
  message: {
    type: String,
    trim: true
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    default: null
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'In Progress', 'Closed', 'Lost'],
    default: 'New'
  },
 source: {
  type: String,
  enum: ['Contact Form', 'Property Inquiry', 'WhatsApp', 'Phone', 'Walk In', 'Website Popup'],
  default: 'Contact Form'
},
  assignedAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Lead', leadSchema)