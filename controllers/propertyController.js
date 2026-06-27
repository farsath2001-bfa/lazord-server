const Property = require('../models/Property')

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
    res.json({ success: true, message: 'Property deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty
}