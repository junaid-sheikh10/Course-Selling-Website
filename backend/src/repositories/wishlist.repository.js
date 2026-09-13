const prisma = require('../db');

const courseDetails = {
  author: {
    select: {
      id: true,
      name: true
    }
  },
  _count: {
    select: {
      enrollments: true
    }
  }
};

function findByUserId(userId) {
  return prisma.wishlistItem.findMany({
    where: { userId },
    include: {
      course: {
        include: courseDetails
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

function add(userId, courseId) {
  return prisma.wishlistItem.upsert({
    where: {
      userId_courseId: { userId, courseId }
    },
    create: { userId, courseId },
    update: {}
  });
}

function remove(userId, courseId) {
  return prisma.wishlistItem.deleteMany({
    where: { userId, courseId }
  });
}

module.exports = { findByUserId, add, remove };
