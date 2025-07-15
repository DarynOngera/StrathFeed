const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

// @route   GET api/categories
// @desc    Get all categories
// @access  Public
router.get('/', categoryController.getAllCategories);

// @route   POST api/categories
// @desc    Create a new category
// @access  Private (Super Admin)
router.post('/', categoryController.createCategory);

// @route   PUT api/categories/:id
// @desc    Update a category
// @access  Private (Super Admin)
router.put('/:id', categoryController.updateCategory);

// @route   DELETE api/categories/:id
// @desc    Delete a category
// @access  Private (Super Admin)
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
