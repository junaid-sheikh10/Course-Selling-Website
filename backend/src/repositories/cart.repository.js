const prisma = require('../db');

function add(userId, courseId) {
  return prisma.cartItem.upsert({
    where: {
      userId_courseId: { userId, courseId }
    },
    create: { userId, courseId },
    update: {}
  });
}

module.exports = { add };
