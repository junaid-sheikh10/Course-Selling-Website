const path = require('node:path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { PrismaClient } = require('@prisma/client');

if (!process.env.DATABASE_URL) {
  throw new Error('Set DATABASE_URL in backend/.env before starting or migrating.');
}

const prisma = new PrismaClient();
module.exports = prisma;
