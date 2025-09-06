// backend/routes/admin/reports.js
const express = require('express');
const router = express.Router();
const Report = require('../../models/Report');
const auth = require('../../middleware/auth');
const requireAdmin = require('../../middleware/admin');

// Get all reports with filtering
router.get('/reports', auth, requireAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const filter = {};

        // Filter by status
        if (req.query.status) {
            filter.status = req.query.status;
        }

        // Filter by type
        if (req.query.type) {
            filter.type = req.query.type;
        }

        // Filter by priority
        if (req.query.priority) {
            filter.priority = req.query.priority;
        }

        // Filter by assigned to current user
        if (req.query.assignedToMe === 'true') {
            filter.assignedTo = req.user._id;
        }

        const reports = await Report.find(filter)
            .populate('reporter', 'username avatar')
            .populate('assignedTo', 'username')
            .populate('resolution.resolvedBy', 'username')
            .sort({ priority: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Report.countDocuments(filter);

        // Get counts for different statuses
        const statusCounts = await Report.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        res.json({
            reports,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total,
            statusCounts: statusCounts.reduce((acc, curr) => {
                acc[curr._id] = curr.count;
                return acc;
            }, {})
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get report by ID
router.get('/reports/:id', auth, requireAdmin, async (req, res) => {
    try {
        const report = await Report.findById(req.params.id)
            .populate('reporter', 'username avatar')
            .populate('assignedTo', 'username')
            .populate('resolution.resolvedBy', 'username');

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        res.json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update report status
router.put('/reports/:id', auth, requireAdmin, async (req, res) => {
    try {
        const { status, priority, assignedTo } = req.body;

        const update = {};
        if (status) update.status = status;
        if (priority) update.priority = priority;
        if (assignedTo) update.assignedTo = assignedTo;

        const report = await Report.findByIdAndUpdate(
            req.params.id,
            update,
            { new: true }
        ).populate('reporter', 'username avatar');

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        res.json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Resolve report
router.post('/reports/:id/resolve', auth, requireAdmin, async (req, res) => {
    try {
        const { action, notes } = req.body;

        const report = await Report.findByIdAndUpdate(
            req.params.id,
            {
                status: 'resolved',
                resolution: {
                    action,
                    notes,
                    resolvedBy: req.user._id,
                    resolvedAt: new Date()
                }
            },
            { new: true }
        ).populate('reporter', 'username avatar');

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        res.json({ message: 'Report resolved successfully', report });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Assign report to yourself
router.post('/reports/:id/assign', auth, requireAdmin, async (req, res) => {
    try {
        const report = await Report.findByIdAndUpdate(
            req.params.id,
            { assignedTo: req.user._id },
            { new: true }
        );

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        res.json({ message: 'Report assigned successfully', report });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;