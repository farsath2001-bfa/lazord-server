const Agent = require('../models/Agent')
const Property = require('../models/Property')
const Lead = require('../models/Lead')
const User = require('../models/User')

const FIELDS = ['name', 'title', 'experience', 'phone', 'whatsapp', 'email', 'photo', 'languages', 'speciality', 'areas', 'order', 'active']

const pick = (body) => {
  const out = {}
  FIELDS.forEach(k => { if (body[k] !== undefined) out[k] = body[k] })
  return out
}

// Creates or updates the staff login linked to an agent (optional).
const syncLogin = async (agent, body) => {
  const email = String(body.loginEmail || '').trim().toLowerCase()
  const password = body.loginPassword
  if (!email && !password) return

  if (agent.user) {
    const u = await User.findById(agent.user)
    if (u) {
      if (email) u.email = email
      if (password) u.password = password
      u.name = agent.name
      u.phone = agent.phone
      u.isActive = agent.active !== false
      await u.save()
      return
    }
  }
  if (!email || !password) throw new Error('A login needs both an email and a password (6+ characters)')
  if (await User.findOne({ email })) throw new Error('That login email is already in use')
  const u = await User.create({ name: agent.name, email, password, role: 'agent', phone: agent.phone })
  agent.user = u._id
  await agent.save()
}

// @route GET /api/agents  (public — active agents only)
const getAgents = async (req, res) => {
  try {
    const agents = await Agent.find({ active: true }).select('-user').sort({ order: 1, createdAt: 1 })
    res.json({ success: true, count: agents.length, data: agents })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route GET /api/agents/admin/all
const getAllAgentsAdmin = async (req, res) => {
  try {
    const agents = await Agent.find().populate('user', 'email isActive').sort({ order: 1, createdAt: 1 })
    res.json({ success: true, count: agents.length, data: agents })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route GET /api/agents/me  (the agent record linked to the logged-in user, or null)
const getMyAgent = async (req, res) => {
  try {
    const agent = await Agent.findOne({ user: req.user._id }).select('name title photo phone')
    res.json({ success: true, data: agent })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @route POST /api/agents
const createAgent = async (req, res) => {
  let agent
  try {
    agent = await Agent.create(pick(req.body))
    await syncLogin(agent, req.body)
    res.status(201).json({ success: true, data: agent })
  } catch (error) {
    if (agent) await Agent.findByIdAndDelete(agent._id)
    res.status(400).json({ success: false, message: error.message })
  }
}

// @route PUT /api/agents/:id
const updateAgent = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndUpdate(req.params.id, pick(req.body), { new: true, runValidators: true })
    if (!agent) return res.status(404).json({ success: false, message: 'Agent not found' })
    await syncLogin(agent, req.body)
    if (req.body.active !== undefined && agent.user) {
      await User.findByIdAndUpdate(agent.user, { isActive: agent.active })
    }
    res.json({ success: true, data: agent })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// @route DELETE /api/agents/:id  (also clears the agent from listings and leads, and removes their login)
const deleteAgent = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndDelete(req.params.id)
    if (!agent) return res.status(404).json({ success: false, message: 'Agent not found' })
    await Promise.all([
      Property.updateMany({ agent: agent._id }, { $set: { agent: null } }),
      Lead.updateMany({ assignedAgent: agent._id }, { $set: { assignedAgent: null } }),
      agent.user ? User.findByIdAndDelete(agent.user) : null
    ])
    res.json({ success: true, message: 'Agent removed' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = { getAgents, getAllAgentsAdmin, getMyAgent, createAgent, updateAgent, deleteAgent }
