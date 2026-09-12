const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const users = require('../repositories/user.repository');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config');
const { AppError } = require('../utils/app-error');

function createToken(userId) {
  return jwt.sign({}, JWT_SECRET, {
    subject: userId,
    expiresIn: JWT_EXPIRES_IN
  });
}

async function signup({ email, password, name, birthYear }) {
  const existingUser = await users.findByEmail(email);
  if (existingUser) {
    throw new AppError(409, 'EMAIL_IN_USE', 'An account with this email already exists');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  let user;
  try {
    user = await users.create({ email, passwordHash, name, birthYear });
  } catch (error) {
    if (error.code === 'P2002') {
      throw new AppError(409, 'EMAIL_IN_USE', 'An account with this email already exists');
    }
    throw error;
  }

  return { user, token: createToken(user.id) };
}

async function login({ email, password }) {
  const userWithPassword = await users.findByEmail(email);
  const passwordMatches = userWithPassword
    ? await bcrypt.compare(password, userWithPassword.passwordHash)
    : false;

  if (!passwordMatches) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect');
  }

  const user = await users.findPublicById(userWithPassword.id);
  return { user, token: createToken(user.id) };
}

module.exports = { signup, login };
