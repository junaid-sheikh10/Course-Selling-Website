const path = require('node:path');
const { spawnSync } = require('node:child_process');
const cwd = path.resolve(__dirname, '..');
require('dotenv').config({ path: path.join(cwd, '.env') });
const args = process.argv.slice(2);
// Generation and validation do not connect to a database.
if (!process.env.DATABASE_URL && ['generate', 'validate', 'format'].includes(args[0])) {
  process.env.DATABASE_URL = 'postgresql://localhost:5432/course_selling';
}
if (!process.env.DATABASE_URL) {
  console.error('Set DATABASE_URL in backend/.env before running this command.');
  process.exit(1);
}
const result = spawnSync(process.execPath, [path.join(path.dirname(require.resolve('prisma/package.json')), 'build/index.js'), ...args], {
  cwd, env: process.env, stdio: 'inherit'
});
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
