const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const asyncHandler = require('../middleware/async-handler');
const { validate } = require('../middleware/validate');
const { signupSchema, loginSchema } = require('../validation/auth.schemas');

const authRouter = Router();

authRouter.post('/signup', validate(signupSchema), asyncHandler(authController.signup));
authRouter.post('/login', validate(loginSchema), asyncHandler(authController.login));

module.exports = { authRouter };
