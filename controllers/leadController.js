const Lead = require('../models/Lead')
const Agent = require('../models/Agent')
const logActivity = require('../utils/logActivity')

// Public enquiry forms may only set these fields (never status, notes or assignment).
const PUBLIC_FIELDS = ['name', 'email', 'phone', 'service', 'message', 'property', 'source']
const pickPublic = (body) => {
  const out = {}
  PUBLIC_FIELDS.forEach(k => { if (body[k] !== undefined) out[k] = body[k] })
  return out
}

const createLead = async (req, res) => {
  try {
    const lead = await Lead.create(pickPublic(req.body))
    logActivity(req, 'received', 'lead', `${lead.name} (${lead.source || 'Website'})`)
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
    if (req.user && req.user.role === 'agent') {
      const me = await Agent.findOne({ user: req.user._id })
      if (!me) return res.json({ success: true, count: 0, data: [] })
      query.assignedAgent = me._id
    }
    if (status) query.status = status
    if (source) query.source = source

    const leads = await Lead.find(query)
      .populate('property', 'title location price')
      .populate('assignedAgent', 'name phone whatsapp')
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
    let update = req.body
    if (req.user && req.user.role === 'agent') {
      const me = await Agent.findOne({ user: req.user._id })
      const own = me && await Lead.exists({ _id: req.params.id, assignedAgent: me._id })
      if (!own) return res.status(403).json({ success: false, message: 'This lead is not assigned to you' })
      update = {}
      ;['status', 'notes', 'followUpAt'].forEach(k => { if (req.body[k] !== undefined) update[k] = req.body[k] })
    }
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    )
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' })
    }
    const changes = Object.keys(update).map(k => (k === 'status' ? `status → ${update.status}` : k)).join(', ')
    logActivity(req, 'updated', 'lead', `${lead.name}: ${changes}`)
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
    logActivity(req, 'deleted', 'lead', lead.name)
    res.json({ success: true, message: 'Lead deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = { createLead, getLeads, updateLead, deleteLead }