const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// @route   POST api/auth/login
// @desc    Authenticate admin and get token
// @access  Public
router.post('/login', authController.loginAdmin);

// @route   POST api/auth/register
// @desc    Register a new admin (for Super Admin)
// @access  Private (Super Admin)
router.post('/register', [authenticate, authorize(['Super'])], authController.registerAdmin);

// @route   GET api/auth/admins
// @desc    Get all admin users
// @access  Private (Super Admin)
router.get('/admins', [authenticate, authorize(['Super'])], authController.getAdmins);

// @route   DELETE api/auth/admins/:id
// @desc    Delete an admin user
// @access  Private (Super Admin)
router.delete('/admins/:id', [authenticate, authorize(['Super'])], authController.deleteAdmin);

module.exports = router;
