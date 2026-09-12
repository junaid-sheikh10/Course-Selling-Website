const { z } = require('zod');

const courseIdParamsSchema = z.strictObject({
  courseId: z.uuid()
});

module.exports = { courseIdParamsSchema };
