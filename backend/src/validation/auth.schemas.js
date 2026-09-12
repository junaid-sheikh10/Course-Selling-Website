const { z } = require('zod');

const email = z.string().trim().toLowerCase().pipe(z.email());
const password = z.string()
  .min(8, 'Password must contain at least 8 characters')
  .max(72, 'Password must contain at most 72 characters');

const signupSchema = z.strictObject({
  name: z.string().trim().min(2).max(80),
  email,
  password,
  birthYear: z.number().int().min(1900).max(new Date().getFullYear()).optional()
});

const loginSchema = z.strictObject({
  email,
  password: z.string().min(1, 'Password is required').max(72)
});

module.exports = { signupSchema, loginSchema };
