const express = require('express');
const router = express.Router();
const { getAuditLogs } = require('../controllers/audit.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// @route   GET api/audit
// @desc    Get audit logs with optional filtering
// @access  Private (Super Admin only)
router.get('/', [authenticate, authorize(['Super'])], getAuditLogs);

module.exports = router;
