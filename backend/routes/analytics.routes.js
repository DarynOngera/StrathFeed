const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/analytics.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// @route   GET /api/analytics
// @desc    Get feedback analytics
// @access  Private (Super Admin only)
router.get('/', authenticate, authorize(['Super']), getAnalytics);

module.exports = router;
