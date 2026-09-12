const users = require('../repositories/user.repository');
const { AppError } = require('../utils/app-error');

async function getProfile(userId) {
  const user = await users.findPublicById(userId);
  if (!user) throw new AppError(404, 'USER_NOT_FOUND', 'User not found');
  return user;
}

async function updateProfile(userId, data) {
  return users.updateProfile(userId, data);
}

async function registerAsAuthor(userId) {
  return users.registerAsAuthor(userId);
}

module.exports = { getProfile, updateProfile, registerAsAuthor };
