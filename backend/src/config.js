const path = require('node:path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Set JWT_SECRET in backend/.env before starting the API.');
}

module.exports = {
  JWT_SECRET,
  JWT_EXPIRES_IN: '7d'
};
