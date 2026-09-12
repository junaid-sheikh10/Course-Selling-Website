const { Router } = require('express');
const courseController = require('../controllers/course.controller');
const asyncHandler = require('../middleware/async-handler');

const courseRouter = Router();

courseRouter.get('/', asyncHandler(courseController.getAll));

module.exports = { courseRouter };
