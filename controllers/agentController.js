const Agent = require('../models/Agent')
const Property = require('../models/Property')
const Lead = require('../models/Lead')

const FIELDS = ['name', 'title', 'experience', 'phone', 'whatsapp', 'email', 'photo', 'languages', 'speciality', 'areas', 'order', 'active']

const pick = (body) => {
  const out = {}
  FIELDS.forEach(k => { if (body[k] !== undefined) out[k] = body[k] })
  return out
}

// @route GET /api/agents  (public — active agents only)
const getAgents = async (req, res) => {
  try {
    const agents = await Agent.find({ active: true }).sort({ order: 1, createdAt: 1 })
    res.json({ success: true, count: agents.length, data: agents })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route GET /api/agents/admin/all
const getAllAgentsAdmin = async (req, res) => {
  try {
    const agents = await Agent.find().sort({ order: 1, createdAt: 1 })
    res.json({ success: true, count: agents.length, data: agents })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route POST /api/agents
const createAgent = async (req, res) => {
  try {
    const agent = await Agent.create(pick(req.body))
    res.status(201).json({ success: true, data: agent })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// @route PUT /api/agents/:id
const updateAgent = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndUpdate(req.params.id, pick(req.body), { new: true, runValidators: true })
    if (!agent) return res.status(404).json({ success: false, message: 'Agent not found' })
    res.json({ success: true, data: agent })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// @route DELETE /api/agents/:id  (also clears the agent from listings and leads)
const deleteAgent = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndDelete(req.params.id)
    if (!agent) return res.status(404).json({ success: false, message: 'Agent not found' })
    await Promise.all([
      Property.updateMany({ agent: agent._id }, { $set: { agent: null } }),
      Lead.updateMany({ assignedAgent: agent._id }, { $set: { assignedAgent: null } })
    ])
    res.json({ success: true, message: 'Agent removed' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = { getAgents, getAllAgentsAdmin, createAgent, updateAgent, deleteAgent }
