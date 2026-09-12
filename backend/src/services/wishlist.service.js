const courses = require('../repositories/course.repository');
const enrollments = require('../repositories/enrollment.repository');
const wishlistItems = require('../repositories/wishlist.repository');
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

  const wishlistItem = await wishlistItems.add(userId, courseId);
  return {
    userId: wishlistItem.userId,
    courseId: wishlistItem.courseId,
    createdAt: wishlistItem.createdAt
  };
}

module.exports = { addCourse };
