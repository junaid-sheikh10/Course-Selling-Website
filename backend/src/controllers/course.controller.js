const courseService = require('../services/course.service');

async function getAll(req, res) {
  const courses = await courseService.getAllCourses();
  return res.status(200).json({ courses });
}

module.exports = { getAll };
