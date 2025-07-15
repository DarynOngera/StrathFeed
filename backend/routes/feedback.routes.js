const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback.controller');
const { authenticate } = require('../middleware/auth.middleware');

// @route   POST api/feedback
// @desc    Submit new feedback
// @access  Public
router.post('/', feedbackController.submitFeedback);

// @route   GET api/feedback/:trackingCode
// @desc    Get feedback status by tracking code
// @access  Public
router.get('/:trackingCode', feedbackController.getFeedbackByTrackingCode);

// @route   GET api/feedback
// @desc    Get all feedback (for admins)
// @access  Private
router.get('/', authenticate, feedbackController.getAllFeedback); 

// @route   PUT api/feedback/flag/:id
// @desc    Flag a feedback submission
// @access  Private
router.put('/flag/:id', authenticate, feedbackController.flagFeedback);

// @route   PUT api/feedback/status/:id
// @desc    Update a feedback submission's status
// @access  Private
router.put('/status/:id', authenticate, feedbackController.updateFeedbackStatus);

module.exports = router;
