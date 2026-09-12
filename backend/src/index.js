const prisma = require('./db');
const express = require('express');
const { authRouter } = require('./routes/auth.routes');
const { meRouter } = require('./routes/me.routes');
const { courseRouter } = require('./routes/course.routes');
const { errorHandler } = require('./middleware/error-handler');

const app = express();
app.use(express.json());
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/me', meRouter);
app.use('/api/v1/courses', courseRouter);
app.use(errorHandler);

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
