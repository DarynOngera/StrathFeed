const db = require('../config/db');

exports.getAnalytics = async (req, res) => {
  try {
    // db.query returns [rows, fields], so we destructure to get just the rows for each query.
    const [
      [totalSubmissionsRows],
      [flaggedSubmissionsRows],
      [submissionsByCategoryRows],
      [submissionsOverTimeRows]
    ] = await Promise.all([
      db.query('SELECT COUNT(*) as totalSubmissions FROM Submissions'),
      db.query('SELECT COUNT(*) as flaggedSubmissions FROM Submissions WHERE flagged = 1'),
      db.query('SELECT c.name, COUNT(s.id) as submissionCount FROM Categories c LEFT JOIN Submissions s ON c.id = s.category_id GROUP BY c.name'),
      db.query(`SELECT DATE_FORMAT(created_at, '%Y-%m-%d') as date, COUNT(id) as count FROM Submissions GROUP BY date ORDER BY date ASC`)
    ]);

    const stats = {
      totalSubmissions: totalSubmissionsRows[0].totalSubmissions,
      flaggedSubmissions: flaggedSubmissionsRows[0].flaggedSubmissions,
      submissionsByCategory: submissionsByCategoryRows,
      submissionsOverTime: submissionsOverTimeRows
    };

    res.json(stats);
  } catch (err) {
    console.error('Error fetching analytics:', err);
    res.status(500).json({ msg: 'Server error while fetching analytics' });
  }
};
