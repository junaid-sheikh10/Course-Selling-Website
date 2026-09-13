const { Router } = require('express');
const userController = require('../controllers/user.controller');
const wishlistController = require('../controllers/wishlist.controller');
const cartController = require('../controllers/cart.controller');
const asyncHandler = require('../middleware/async-handler');
const { authenticate } = require('../middleware/authenticate');
const { validate } = require('../middleware/validate');
const { updateProfileSchema } = require('../validation/user.schemas');
const { courseIdParamsSchema } = require('../validation/course.schemas');

const meRouter = Router();

meRouter.use(authenticate);

meRouter.get('/', asyncHandler(userController.getProfile));
meRouter.patch('/', validate(updateProfileSchema), asyncHandler(userController.updateProfile));
meRouter.post('/author-registration', asyncHandler(userController.registerAsAuthor));
meRouter.get('/wishlist', asyncHandler(wishlistController.getAll));
meRouter.put(
  '/wishlist/:courseId',
  validate(courseIdParamsSchema, 'params'),
  asyncHandler(wishlistController.addCourse)
);
meRouter.delete(
  '/wishlist/:courseId',
  validate(courseIdParamsSchema, 'params'),
  asyncHandler(wishlistController.removeCourse)
);
meRouter.put(
  '/cart/:courseId',
  validate(courseIdParamsSchema, 'params'),
  asyncHandler(cartController.addCourse)
);

module.exports = { meRouter };
