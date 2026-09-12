const { Prisma } = require('@prisma/client');

function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  const status = error.statusCode
    || ({ P2002: 409, P2003: 400, P2000: 400, P2004: 400, P2011: 400, P2020: 400, P2023: 400 }[error.code])
    || (error instanceof Prisma.PrismaClientValidationError ? 400 : 500);

  const response = {
    error: {
      code: error.code || 'INTERNAL_SERVER_ERROR',
      message: status === 500 ? 'Internal server error' : error.message
    }
  };

  if (error.details) response.error.details = error.details;
  if (status === 500) console.error(error);

  return res.status(status).json(response);
}

module.exports = { errorHandler };
