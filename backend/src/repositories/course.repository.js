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

function findAll() {
  return prisma.course.findMany({
    include: courseDetails,
    orderBy: { createdAt: 'desc' }
  });
}

function findById(id) {
  return prisma.course.findUnique({
    where: { id },
    include: courseDetails
  });
}

module.exports = { findAll, findById };
