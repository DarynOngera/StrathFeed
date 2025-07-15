const crypto = require('crypto');

// Function to generate a unique tracking code
const generateTrackingCode = () => {
  // Generate 8 random bytes and convert to a hex string for a 16-character code
  return crypto.randomBytes(8).toString('hex');
};

module.exports = { generateTrackingCode };
