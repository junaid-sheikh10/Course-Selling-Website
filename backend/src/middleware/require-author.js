const { AppError } = require('../utils/app-error');

function requireAuthor(req, res, next) {
  if (req.user?.role !== 'AUTHOR') {
    return next(new AppError(
      403,
      'AUTHOR_REQUIRED',
      'Register as an author to perform this action'
    ));
  }

  return next();
}

module.exports = { requireAuthor };
