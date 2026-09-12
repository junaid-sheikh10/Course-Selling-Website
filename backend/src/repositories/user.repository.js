const prisma = require('../db');

const publicUserSelect = {
  id: true,
  email: true,
  name: true,
  birthYear: true,
  role: true,
  createdAt: true,
  updatedAt: true
};

function create(data) {
  return prisma.user.create({ data, select: publicUserSelect });
}

function findByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

function findPublicById(id) {
  return prisma.user.findUnique({ where: { id }, select: publicUserSelect });
}

function updateProfile(id, data) {
  return prisma.user.update({ where: { id }, data, select: publicUserSelect });
}

function registerAsAuthor(id) {
  return prisma.user.update({
    where: { id },
    data: { role: 'AUTHOR' },
    select: publicUserSelect
  });
}

module.exports = {
  create,
  findByEmail,
  findPublicById,
  updateProfile,
  registerAsAuthor
};
