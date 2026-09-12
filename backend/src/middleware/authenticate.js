const jwt = require('jsonwebtoken');
const users = require('../repositories/user.repository');
const { JWT_SECRET } = require('../config');
const { AppError } = require('../utils/app-error');

async function authenticate(req, res, next) {
  try {
    const authorization = req.get('authorization');
    if (!authorization?.startsWith('Bearer ')) {
      throw new AppError(401, 'AUTHENTICATION_REQUIRED', 'A Bearer token is required');
    }

    const token = authorization.slice('Bearer '.length).trim();
    if (!token) {
      throw new AppError(401, 'AUTHENTICATION_REQUIRED', 'A Bearer token is required');
    }

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      throw new AppError(401, 'INVALID_TOKEN', 'The authentication token is invalid or expired');
    }

    const user = typeof payload.sub === 'string'
      ? await users.findPublicById(payload.sub)
      : null;
    if (!user) {
      throw new AppError(401, 'INVALID_TOKEN', 'The authentication token is invalid or expired');
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = { authenticate };
