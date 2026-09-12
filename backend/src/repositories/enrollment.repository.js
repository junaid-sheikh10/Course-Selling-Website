const prisma = require('../db');

function findByUserAndCourse(userId, courseId) {
  return prisma.enrollment.findUnique({
    where: {
      userId_courseId: { userId, courseId }
    }
  });
}

module.exports = { findByUserAndCourse };
