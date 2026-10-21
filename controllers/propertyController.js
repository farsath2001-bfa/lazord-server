const Property = require('../models/Property')
const logActivity = require('../utils/logActivity')

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res) => {
  try {
    const { type, category, location, beds, minPrice, maxPrice, featured, search, sort } = req.query

    let query = {}

    // Filters
    if (type)      query.type     = type
    if (category)  query.category = category
    if (location)  query.location = { $regex: location, $options: 'i' }
    if (featured)  query.featured = featured === 'true'
    if (beds)      query.bedrooms = beds === 'Studio' ? 0 : parseInt(beds)

    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = parseInt(minPrice)
      if (maxPrice) query.price.$lte = parseInt(maxPrice)
    }

    if (search) {
      query.$or = [
        { title:     { $regex: search, $options: 'i' } },
        { location:  { $regex: search, $options: 'i' } },
        { community: { $regex: search, $options: 'i' } },
      ]
    }

    // Sorting
    let sortOption = { createdAt: -1 }
    if (sort === 'price_asc')  sortOption = { price: 1 }
    if (sort === 'price_desc') sortOption = { price: -1 }
    if (sort === 'area_desc')  sortOption = { area: -1 }

    const properties = await Property.find(query).sort(sortOption)

    res.json({
      success: true,
      count: properties.length,
      data: properties
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('agent', 'name title phone whatsapp photo languages')
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' })
    }
    res.json({ success: true, data: property })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Create property
// @route   POST /api/properties
// @access  Private (Admin)
const createProperty = async (req, res) => {
  try {
    const property = await Property.create(req.body)
    logActivity(req, 'created', 'property', property.title)
    res.status(201).json({ success: true, data: property })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Admin)
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' })
    }
    logActivity(req, 'updated', 'property', property.title)
    res.json({ success: true, data: property })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Admin)
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id)
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' })
    }
    logActivity(req, 'deleted', 'property', property.title)
    res.json({ success: true, message: 'Property deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Bulk update (status / featured / agent / tag) for several properties
// @route   PUT /api/properties/bulk
// @access  Private (Admin)
const bulkUpdateProperties = async (req, res) => {
  try {
    const { ids, update } = req.body
    if (!Array.isArray(ids) || ids.length === 0 || ids.length > 200) {
      return res.status(400).json({ success: false, message: 'Select between 1 and 200 properties' })
    }
    const allowed = ['status', 'featured', 'agent', 'tag']
    const set = {}
    allowed.forEach(k => { if (update && update[k] !== undefined) set[k] = update[k] })
    if (Object.keys(set).length === 0) {
      return res.status(400).json({ success: false, message: 'Nothing to update' })
    }
    const result = await Property.updateMany({ _id: { $in: ids } }, { $set: set }, { runValidators: true })
    logActivity(req, 'bulk-updated', 'property', `${result.modifiedCount} listings: ${Object.keys(set).join(', ')}`)
    res.json({ success: true, modified: result.modifiedCount })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// @desc    Bulk delete properties
// @route   POST /api/properties/bulk-delete
// @access  Private (Admin)
const bulkDeleteProperties = async (req, res) => {
  try {
    const { ids } = req.body
    if (!Array.isArray(ids) || ids.length === 0 || ids.length > 200) {
      return res.status(400).json({ success: false, message: 'Select between 1 and 200 properties' })
    }
    const result = await Property.deleteMany({ _id: { $in: ids } })
    logActivity(req, 'bulk-deleted', 'property', `${result.deletedCount} listings`)
    res.json({ success: true, deleted: result.deletedCount })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  bulkUpdateProperties,
  bulkDeleteProperties
}