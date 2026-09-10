const { randomUUID } = require('node:crypto');
const pool = require('../db');

// Keep existing API field names while using snake_case SQL columns.
const accountColumns = 'id AS _id, email, password, first_name AS "firstName", last_name AS "lastName"';
const courseColumns = 'id AS _id, title, description, price, image_url AS "imageUrl", creator_id AS "creatorId", creator_name AS "creatorName"';
const purchaseColumns = 'id AS _id, user_id AS "userId", course_id AS "courseId"';
// NUMERIC stays exact in PostgreSQL; preserve the existing numeric API price.
const courseRow = row => row && ({ ...row, price: Number(row.price) });

function accounts(table) {
  // table is supplied only by the two fixed calls below, never request input.
  return {
    async create({ email, password, firstName, lastName }) {
      const result = await pool.query(`INSERT INTO ${table} (id, email, password, first_name, last_name)
        VALUES ($1, $2, $3, $4, $5) RETURNING ${accountColumns}`,
      [randomUUID(), email, password, firstName, lastName]);
      return result.rows[0];
    },
    async findByEmail(email) {
      const result = await pool.query(`SELECT ${accountColumns} FROM ${table} WHERE email = $1`, [email]);
      return result.rows[0];
    }
  };
}

const users = accounts('users');
const admins = accounts('admins');
const courses = {
  async create({ title, description, price, imageUrl, creatorId, creatorName }) {
    const result = await pool.query(`INSERT INTO courses
      (id, title, description, price, image_url, creator_id, creator_name)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING ${courseColumns}`,
    [randomUUID(), title, description, price, imageUrl, creatorId, creatorName]);
    return courseRow(result.rows[0]);
  },
  async list() {
    return (await pool.query(`SELECT ${courseColumns} FROM courses`)).rows.map(courseRow);
  },
  async listByCreator(id) {
    return (await pool.query(`SELECT ${courseColumns} FROM courses WHERE creator_id = $1`, [id])).rows.map(courseRow);
  },
  async listByIds(ids) {
    return (await pool.query(`SELECT ${courseColumns} FROM courses WHERE id = ANY($1::uuid[])`, [ids])).rows.map(courseRow);
  },
  async updateOwned(id, creatorId, { title, description, imageUrl, price }) {
    const result = await pool.query(`UPDATE courses SET title = COALESCE($3, title),
      description = COALESCE($4, description), image_url = COALESCE($5, image_url),
      price = COALESCE($6, price) WHERE id = $1 AND creator_id = $2 RETURNING ${courseColumns}`,
    [id, creatorId, title, description, imageUrl, price]);
    return courseRow(result.rows[0]);
  }
};
const purchases = {
  async create({ userId, courseId }) {
    return (await pool.query(`INSERT INTO purchases (id, user_id, course_id)
      VALUES ($1, $2, $3) RETURNING ${purchaseColumns}`, [randomUUID(), userId, courseId])).rows[0];
  },
  async listByUser(userId) {
    return (await pool.query(`SELECT ${purchaseColumns} FROM purchases WHERE user_id = $1`, [userId])).rows;
  }
};
module.exports = { users, admins, courses, purchases };
