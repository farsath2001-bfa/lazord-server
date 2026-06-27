const Lead = require('../models/Lead')

const createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body)
    res.status(201).json({ success: true, data: lead })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private (Admin)
const getLeads = async (req, res) => {
  try {
    const { status, source } = req.query
    let query = {}
    if (status) query.status = status
    if (source) query.source = source

    const leads = await Lead.find(query)
      .populate('property', 'title location price')
      .populate('assignedAgent', 'name email')
      .sort({ createdAt: -1 })

    res.json({ success: true, count: leads.length, data: leads })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Update lead status
// @route   PUT /api/leads/:id
// @access  Private (Admin)
const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' })
    }
    res.json({ success: true, data: lead })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private (Admin)
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id)
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' })
    }
    res.json({ success: true, message: 'Lead deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = { createLead, getLeads, updateLead, deleteLead }