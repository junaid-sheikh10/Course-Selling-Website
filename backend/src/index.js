const prisma = require('./db');
const { Prisma } = require('@prisma/client');
const express = require('express');
const { adminRouter } = require('./routes/admin');
const { userRouter } = require('./routes/user');
const { courseRouter } = require('./routes/course');

const app = express();
app.use(express.json());
app.use('/api/v1/user', userRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/course', courseRouter);
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  const status = { P2002: 409, P2003: 400, P2000: 400, P2004: 400, P2011: 400, P2020: 400, P2023: 400 }[error.code]
    || (error instanceof Prisma.PrismaClientValidationError ? 400 : undefined);
  res.status(status || 500).json({ msg: status === 409 ? 'Record already exists' : status ? 'Invalid database input' : 'Internal server error' });
});

async function main() {
  await prisma.$connect();
  const port = process.env.PORT || 3300;
  const server = app.listen(port, () => console.log(`Listening on port ${port}`));
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, () => server.close(() => prisma.$disconnect()));
  }
}
if (require.main === module) main().catch(async error => {
  console.error('Startup failed:', error.code || 'database error');
  await prisma.$disconnect();
  process.exitCode = 1;
});
module.exports = app;
