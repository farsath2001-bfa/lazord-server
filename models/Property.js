const mongoose = require('mongoose')

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['Buy', 'Rent', 'Off Plan'],
    required: [true, 'Property type is required']
  },
  category: {
    type: String,
    enum: ['Apartment', 'Villa', 'Penthouse', 'Townhouse', 'Studio', 'Commercial'],
    required: [true, 'Property category is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  currency: {
    type: String,
    default: 'AED'
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  community: {
    type: String,
    trim: true
  },
  bedrooms: {
    type: Number,
    default: 0
  },
  bathrooms: {
    type: Number,
    default: 1
  },
  area: {
    type: Number,
    required: [true, 'Area is required']
  },
  areaUnit: {
    type: String,
    default: 'sqft'
  },
  image: {
    type: String,
    required: [true, 'Main image is required']
  },
  gallery: [{
    type: String
  }],
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['Available', 'Sold', 'Rented', 'Off Plan'],
    default: 'Available'
  },
  completionYear: {
    type: Number
  },
  developer: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  amenities: [{
    type: String
  }],
  tag: {
    type: String,
    default: 'New'
  },
  roi: {
    type: String
  },
  coords: {
    lat: { type: Number },
    lng: { type: Number }
  }
}, {
  timestamps: true
})

// Search index
propertySchema.index({ title: 'text', location: 'text', community: 'text' })

module.exports = mongoose.model('Property', propertySchema)