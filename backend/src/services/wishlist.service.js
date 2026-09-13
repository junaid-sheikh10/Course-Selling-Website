const courses = require('../repositories/course.repository');
const enrollments = require('../repositories/enrollment.repository');
const wishlistItems = require('../repositories/wishlist.repository');
const { serializeCourse } = require('./course.service');
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

async function getWishlist(userId) {
  const items = await wishlistItems.findByUserId(userId);
  return items.map(item => ({
    addedAt: item.createdAt,
    course: serializeCourse(item.course)
  }));
}

async function removeCourse(userId, courseId) {
  const result = await wishlistItems.remove(userId, courseId);
  if (result.count === 0) {
    throw new AppError(404, 'WISHLIST_ITEM_NOT_FOUND', 'Course is not in your wishlist');
  }
}

module.exports = { getWishlist, addCourse, removeCourse };
