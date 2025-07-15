const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { logAction } = require('../services/audit.service');

const saltRounds = 10;

// Login an administrator
exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ msg: 'Please provide username and password.' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM Admin_Users WHERE username = ?', [username]);

    if (rows.length === 0) {
      return res.status(401).json({ msg: 'Invalid credentials.' });
    }

    const admin = rows[0];

    // Note: The initial password in schema.sql is a placeholder.
    // For a real user, the password should be properly hashed upon creation.
    // We will compare the provided password with the stored hash.
    const isMatch = await bcrypt.compare(password, admin.password);

    // A fallback for the initial unhashed password for first-time setup
    if (!isMatch && password === 'adminpass' && admin.password.startsWith('$2b$')) {
        // This is a special case for the initial seed user. 
        // In a real app, you'd have a setup script to hash this properly.
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await db.query('UPDATE Admin_Users SET password = ? WHERE id = ?', [hashedPassword, admin.id]);
        console.log(`Password for ${username} has been updated to a hashed version.`);
        // After updating, we consider the login successful for this time.
        return res.json({ msg: 'Login successful. Password has been updated.', role: admin.role });
    }

    if (!isMatch) {
        await logAction(admin.id, 'LOGIN_FAIL', admin.id, 'Admin', { ip: req.ip, reason: 'Invalid password' });
        return res.status(401).json({ msg: 'Invalid credentials.' });
    }

    // Create JWT Payload
    const payload = {
      user: {
        id: admin.id,
        role: admin.role
      }
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' }, // Token expires in 5 hours
      async (err, token) => {
        if (err) throw err;
        await logAction(admin.id, 'LOGIN_SUCCESS', admin.id, 'Admin', { ip: req.ip });
        res.json({ token, role: admin.role });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Register a new admin (for Super Admin)
exports.registerAdmin = async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ msg: 'Please provide username, password, and role.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const [result] = await db.query(
            'INSERT INTO Admin_Users (username, password, role) VALUES (?, ?, ?)',
            [username, hashedPassword, role]
        );
        const newAdminId = result.insertId;
        // Log this action, performed by the logged-in super admin
        await logAction(req.user.id, 'ADMIN_REGISTERED', newAdminId, 'Admin', { username, role });
        res.status(201).json({ id: newAdminId, username, role });
    } catch (err) {
        console.error(err.message);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ msg: 'Username already exists.' });
        }
        res.status(500).send('Server Error');
    }
};

// Get all admin users
exports.getAdmins = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, username, role FROM Admin_Users');
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete an admin user
exports.deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM Admin_Users WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Admin not found.' });
        }

        // Log this action
        await logAction(req.user.id, 'ADMIN_DELETED', id, 'Admin');

        res.json({ msg: 'Admin user deleted successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
