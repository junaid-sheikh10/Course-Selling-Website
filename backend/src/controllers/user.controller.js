const userService = require('../services/user.service');

async function getProfile(req, res) {
  const user = await userService.getProfile(req.user.id);
  return res.status(200).json({ user });
}

async function updateProfile(req, res) {
  const user = await userService.updateProfile(req.user.id, req.body);
  return res.status(200).json({ user });
}

async function registerAsAuthor(req, res) {
  const user = await userService.registerAsAuthor(req.user.id);
  return res.status(200).json({
    message: 'You are now registered as an author',
    user
  });
}

module.exports = { getProfile, updateProfile, registerAsAuthor };
