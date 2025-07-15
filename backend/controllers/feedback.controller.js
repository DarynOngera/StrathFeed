const db = require('../config/db');
const { encrypt, decrypt } = require('../utils/crypto');
const { generateTrackingCode } = require('../utils/trackingCode');
const { logAction } = require('../services/audit.service');

// Submit new feedback
exports.submitFeedback = async (req, res) => {
  const { content, category_id } = req.body;

  if (!content || !category_id) {
    return res.status(400).json({ msg: 'Please provide content and a category.' });
  }

  try {
    const encryptedContent = encrypt(content);
    const trackingCode = generateTrackingCode();

    const [result] = await db.query(
      'INSERT INTO Submissions (content, category_id, tracking_code) VALUES (?, ?, ?)',
      [encryptedContent, category_id, trackingCode]
    );

    res.status(201).json({ 
      msg: 'Feedback submitted successfully.',
      trackingCode: trackingCode 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get feedback by tracking code
exports.getFeedbackByTrackingCode = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, category_id, created_at, flagged FROM Submissions WHERE tracking_code = ?', [req.params.trackingCode]);

    if (rows.length === 0) {
      return res.status(404).json({ msg: 'Feedback not found.' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all feedback submissions (for admins)
exports.getAllFeedback = async (req, res) => {
    try {
        const query = `
            SELECT s.id, s.content, s.created_at, s.flagged, s.status, c.name as category_name
            FROM Submissions s
            JOIN Categories c ON s.category_id = c.id
            ORDER BY s.created_at DESC
        `;

        const [rows] = await db.query(query);

        const feedback = rows.map(row => {
            let decryptedContent;
            try {
                decryptedContent = decrypt(row.content);
            } catch (e) {
                decryptedContent = row.content; // Fallback for unencrypted data
            }
            return {
                ...row,
                content: decryptedContent
            };
        });

        res.json(feedback);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Flag a feedback submission
exports.flagFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user.id; // Assuming auth middleware provides req.user

        const [submissionRows] = await db.query('SELECT flagged FROM Submissions WHERE id = ?', [id]);

        if (submissionRows.length === 0) {
            return res.status(404).json({ msg: 'Submission not found' });
        }

        const oldStatus = submissionRows[0].flagged;
        const newFlaggedStatus = !oldStatus;

        await db.query('UPDATE Submissions SET flagged = ? WHERE id = ?', [newFlaggedStatus, id]);

        // Log this action
        await logAction(adminId, 'FLAG_TOGGLED', id, 'Submission', { from: oldStatus, to: newFlaggedStatus });

        res.json({ msg: 'Feedback flag status updated.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update feedback status
exports.updateFeedbackStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status: newStatus } = req.body;
        const adminId = req.user.id; // Assuming auth middleware provides req.user

        // Validate the status
        if (!['New', 'Under Review', 'Resolved'].includes(newStatus)) {
            return res.status(400).json({ msg: 'Invalid status value.' });
        }

        // Get the old status for logging
        const [submissionRows] = await db.query('SELECT status FROM Submissions WHERE id = ?', [id]);

        if (submissionRows.length === 0) {
            return res.status(404).json({ msg: 'Submission not found' });
        }
        const oldStatus = submissionRows[0].status;

        // Update the database
        await db.query('UPDATE Submissions SET status = ? WHERE id = ?', [newStatus, id]);

        // Log this action
        await logAction(adminId, 'STATUS_UPDATED', id, 'Submission', { from: oldStatus, to: newStatus });

        res.json({ msg: 'Feedback status updated successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
