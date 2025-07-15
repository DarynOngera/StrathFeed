require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Body parser for JSON requests

// API Routes
app.use('/api/feedback', require('./routes/feedback.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/analytics', require('./routes/analytics.routes'));
app.use('/api/audit', require('./routes/audit.routes'));

// Root endpoint
app.get('/', (req, res) => {
  res.send('StrathFeed API is running...');
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
