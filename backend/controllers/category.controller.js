const db = require('../config/db');

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Categories ORDER BY name ASC');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ msg: 'Category name is required.' });
  }

  try {
    const [result] = await db.query('INSERT INTO Categories (name) VALUES (?)', [name]);
    res.status(201).json({ id: result.insertId, name });
  } catch (err) {
    console.error(err.message);
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ msg: 'Category already exists.' });
    }
    res.status(500).send('Server Error');
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ msg: 'Category name is required.' });
  }

  try {
    const [result] = await db.query('UPDATE Categories SET name = ? WHERE id = ?', [name, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Category not found.' });
    }
    res.json({ msg: 'Category updated successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    // Optional: Check if any submissions are using this category before deleting
    const [submissions] = await db.query('SELECT id FROM Submissions WHERE category_id = ?', [id]);
    if (submissions.length > 0) {
      return res.status(400).json({ msg: 'Cannot delete category as it is currently in use.' });
    }

    const [result] = await db.query('DELETE FROM Categories WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Category not found.' });
    }
    res.json({ msg: 'Category deleted successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
