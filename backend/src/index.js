const pool = require('./db');
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
  const status = { '23505': 409, '23503': 400, '23502': 400, '23514': 400, '22P02': 400, '22003': 400 }[error.code];
  res.status(status || 500).json({ msg: status === 409 ? 'Record already exists' : status ? 'Invalid database input' : 'Internal server error' });
});

async function main() {
  await pool.query('SELECT 1');
  const port = process.env.PORT || 3300;
  const server = app.listen(port, () => console.log(`Listening on port ${port}`));
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, () => server.close(() => pool.end()));
  }
}
if (require.main === module) main().catch(async error => {
  console.error('Startup failed:', error.code || 'database error');
  await pool.end();
  process.exitCode = 1;
});
module.exports = app;
