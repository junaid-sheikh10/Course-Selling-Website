const { z } = require('zod');

const updateProfileSchema = z.strictObject({
  name: z.string().trim().min(2).max(80).optional(),
  birthYear: z.union([
    z.number().int().min(1900).max(new Date().getFullYear()),
    z.null()
  ]).optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'Provide at least one profile field'
});

module.exports = { updateProfileSchema };
