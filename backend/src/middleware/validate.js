const { AppError } = require('../utils/app-error');

function validate(schema, source = 'body') {
  return function validationMiddleware(req, res, next) {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const details = result.error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message
      }));
      return next(new AppError(400, 'VALIDATION_ERROR', 'Request validation failed', details));
    }

    req[source] = result.data;
    return next();
  };
}

module.exports = { validate };
