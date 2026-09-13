const cartItems = require('../repositories/cart.repository');
const courses = require('../repositories/course.repository');
const enrollments = require('../repositories/enrollment.repository');
const { AppError } = require('../utils/app-error');

async function addCourse(userId, courseId) {
  const course = await courses.findById(courseId);
  if (!course) {
    throw new AppError(404, 'COURSE_NOT_FOUND', 'Course not found');
  }

  const enrollment = await enrollments.findByUserAndCourse(userId, courseId);
  if (enrollment) {
    throw new AppError(409, 'COURSE_ALREADY_OWNED', 'You are already enrolled in this course');
  }

  if (course._count.enrollments >= course.seatLimit) {
    throw new AppError(409, 'COURSE_FULL', 'This course has no available seats');
  }

  const cartItem = await cartItems.add(userId, courseId);
  return {
    userId: cartItem.userId,
    courseId: cartItem.courseId,
    createdAt: cartItem.createdAt
  };
}

module.exports = { addCourse };
