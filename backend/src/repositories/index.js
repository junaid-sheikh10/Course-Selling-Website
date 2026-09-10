const prisma = require('../db');

// Preserve the existing API shape while Prisma uses conventional `id` fields.
function apiRow(row) {
  if (!row) return undefined;
  const { id, purchasedAt, ...fields } = row;
  return { _id: id, ...fields };
}
function courseRow(row) {
  return row && { ...apiRow(row), price: Number(row.price) };
}
function accounts(model) {
  return {
    async create({ email, password, firstName, lastName }) {
      return apiRow(await model.create({ data: { email, password, firstName, lastName } }));
    },
    async findByEmail(email) {
      return apiRow(await model.findUnique({ where: { email } }));
    }
  };
}

const users = accounts(prisma.user);
const admins = accounts(prisma.admin);
const courses = {
  async create({ title, description, price, imageUrl, creatorId, creatorName }) {
    return courseRow(await prisma.course.create({
      data: { title, description, price, imageUrl, creatorId, creatorName }
    }));
  },
  async list() {
    return (await prisma.course.findMany()).map(courseRow);
  },
  async listByCreator(creatorId) {
    return (await prisma.course.findMany({ where: { creatorId } })).map(courseRow);
  },
  async listByIds(ids) {
    return (await prisma.course.findMany({ where: { id: { in: ids } } })).map(courseRow);
  },
  async updateOwned(id, creatorId, { title, description, imageUrl, price }) {
    // Preserve the previous COALESCE behavior for omitted/null update fields.
    const data = Object.fromEntries(Object.entries({ title, description, imageUrl, price })
      .filter(([, value]) => value != null));
    try {
      return courseRow(await prisma.course.update({ where: { id, creatorId }, data }));
    } catch (error) {
      if (error.code === 'P2025') return undefined;
      throw error;
    }
  }
};
const purchases = {
  async create({ userId, courseId }) {
    return apiRow(await prisma.purchase.create({ data: { userId, courseId } }));
  },
  async listByUser(userId) {
    return (await prisma.purchase.findMany({ where: { userId } })).map(apiRow);
  }
};
module.exports = { users, admins, courses, purchases };
