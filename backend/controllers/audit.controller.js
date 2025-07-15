const db = require('../config/db');

// Get all audit logs with filtering capabilities
exports.getAuditLogs = async (req, res) => {
    try {
        let query = `
            SELECT al.id, al.action_type, al.target_id, al.target_type, al.details, al.created_at, au.username as admin_username
            FROM ActionLogs al
            JOIN Admin_Users au ON al.admin_id = au.id
        `;
        
        const { adminId, actionType, targetType, startDate, endDate } = req.query;
        const params = [];
        const conditions = [];

        if (adminId) {
            conditions.push('al.admin_id = ?');
            params.push(adminId);
        }
        if (actionType) {
            conditions.push('al.action_type = ?');
            params.push(actionType);
        }
        if (targetType) {
            conditions.push('al.target_type = ?');
            params.push(targetType);
        }
        if (startDate) {
            conditions.push('al.created_at >= ?');
            params.push(startDate);
        }
        if (endDate) {
            conditions.push('al.created_at <= ?');
            params.push(endDate);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        
        query += ' ORDER BY al.created_at DESC';

        const [logs] = await db.query(query, params);
        
        res.json(logs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
