const db = require('../config/db');

/**
 * Logs an administrative action to the database.
 * @param {number} adminId - The ID of the admin performing the action.
 * @param {string} actionType - The type of action (e.g., 'STATUS_UPDATE').
 * @param {number} [targetId] - The ID of the entity being acted upon.
 * @param {string} [targetType] - The type of the entity (e.g., 'Submission').
 * @param {object} [details] - A JSON object for extra information, like old/new values.
 */
const logAction = async (adminId, actionType, targetId = null, targetType = null, details = null) => {
  try {
    const detailsString = details ? JSON.stringify(details) : null;
    await db.query(
      'INSERT INTO ActionLogs (admin_id, action_type, target_id, target_type, details) VALUES (?, ?, ?, ?, ?)',
      [adminId, actionType, targetId, targetType, detailsString]
    );
  } catch (error) {
    console.error('Failed to log action:', error);
    // Depending on the policy, you might want to throw the error
    // or just log it without interrupting the main operation.
  }
};

module.exports = { logAction };
