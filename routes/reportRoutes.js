const express = require('express')
const router = express.Router()
const Lead = require('../models/Lead')
const Property = require('../models/Property')
const { protect, adminOnly } = require('../middleware/authMiddleware')

const closedCount = { $sum: { $cond: [{ $eq: ['$status', 'Closed'] }, 1, 0] } }

// @route GET /api/reports/leads?from=YYYY-MM-DD&to=YYYY-MM-DD
// Lead summary for the owner. Defaults to the current month.
router.get('/leads', protect, adminOnly, async (req, res) => {
  try {
    const now = new Date()
    const from = req.query.from ? new Date(`${req.query.from}T00:00:00.000Z`) : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
    const to = req.query.to ? new Date(`${req.query.to}T23:59:59.999Z`) : now
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || from > to) {
      return res.status(400).json({ success: false, message: 'Invalid date range' })
    }

    const [r] = await Lead.aggregate([
      { $match: { createdAt: { $gte: from, $lte: to } } },
      {
        $facet: {
          total: [{ $count: 'n' }],
          closed: [{ $match: { status: 'Closed' } }, { $count: 'n' }],
          lost: [{ $match: { status: 'Lost' } }, { $count: 'n' }],
          bySource: [{ $group: { _id: '$source', count: { $sum: 1 }, closed: closedCount } }, { $sort: { count: -1 } }],
          byStatus: [{ $group: { _id: '$status', count: { $sum: 1 } } }, { $sort: { count: -1 } }],
          byService: [{ $group: { _id: '$service', count: { $sum: 1 }, closed: closedCount } }, { $sort: { count: -1 } }],
          byAgent: [
            { $group: { _id: '$assignedAgent', count: { $sum: 1 }, closed: closedCount } },
            { $lookup: { from: 'agents', localField: '_id', foreignField: '_id', as: 'a' } },
            { $project: { _id: 0, count: 1, closed: 1, name: { $ifNull: [{ $arrayElemAt: ['$a.name', 0] }, 'Unassigned'] } } },
            { $sort: { count: -1 } }
          ],
          byDay: [
            { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'Asia/Dubai' } }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
          ]
        }
      }
    ])

    const n = (arr) => (arr[0] ? arr[0].n : 0)
    const [listings, available] = await Promise.all([
      Property.countDocuments(),
      Property.countDocuments({ status: 'Available' })
    ])

    res.json({
      success: true,
      data: {
        from, to,
        total: n(r.total),
        closed: n(r.closed),
        lost: n(r.lost),
        bySource: r.bySource.map(x => ({ name: x._id || 'Unknown', count: x.count, closed: x.closed })),
        byStatus: r.byStatus.map(x => ({ name: x._id || 'Unknown', count: x.count })),
        byService: r.byService.map(x => ({ name: x._id || 'Unknown', count: x.count, closed: x.closed })),
        byAgent: r.byAgent,
        byDay: r.byDay.map(x => ({ day: x._id, count: x.count })),
        listings, available
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router
