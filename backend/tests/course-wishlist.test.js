const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src');
const prisma = require('../src/db');

const TEST_USER_EMAIL = 'wishlist.integration@example.com';
const TEST_AUTHOR_EMAIL = 'wishlist.author.integration@example.com';
const TEST_COURSE_ID = '20000000-0000-4000-8000-000000000001';
const MISSING_COURSE_ID = '20000000-0000-4000-8000-000000000099';
let server;
let baseUrl;

async function request(path, { method = 'GET', body, token } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      ...(body ? { 'content-type': 'application/json' } : {}),
      ...(token ? { authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  return { status: response.status, body: await response.json() };
}

async function cleanTestData() {
  await prisma.wishlistItem.deleteMany({ where: { courseId: TEST_COURSE_ID } });
  await prisma.cartItem.deleteMany({ where: { courseId: TEST_COURSE_ID } });
  await prisma.enrollment.deleteMany({ where: { courseId: TEST_COURSE_ID } });
  await prisma.course.deleteMany({ where: { id: TEST_COURSE_ID } });
  await prisma.user.deleteMany({
    where: { email: { in: [TEST_USER_EMAIL, TEST_AUTHOR_EMAIL] } }
  });
}

test.before(async () => {
  await cleanTestData();
  const author = await prisma.user.create({
    data: {
      email: TEST_AUTHOR_EMAIL,
      passwordHash: 'not-used-by-this-test',
      name: 'Wishlist Test Author',
      role: 'AUTHOR'
    }
  });
  await prisma.course.create({
    data: {
      id: TEST_COURSE_ID,
      title: 'Wishlist Test Course',
      description: 'A course created for API integration testing.',
      priceInCents: 2500,
      seatLimit: 5,
      authorId: author.id
    }
  });

  await new Promise((resolve, reject) => {
    server = app.listen(0, '127.0.0.1', resolve);
    server.once('error', reject);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  await cleanTestData();
  await new Promise(resolve => server.close(resolve));
  await prisma.$disconnect();
});

test('lists courses and adds a course to the wishlist and cart', async () => {
  const courseResponse = await request('/api/v1/courses');
  assert.equal(courseResponse.status, 200);

  const course = courseResponse.body.courses.find(item => item.id === TEST_COURSE_ID);
  assert.ok(course);
  assert.equal(course.currency, 'EUR');
  assert.equal(course.seatLimit, 5);
  assert.equal(course.occupiedSeats, 0);
  assert.equal(course.availableSeats, 5);
  assert.equal(course.isFull, false);
  assert.equal(course.author.name, 'Wishlist Test Author');
  assert.equal(course.authorId, undefined);

  const signup = await request('/api/v1/auth/signup', {
    method: 'POST',
    body: {
      name: 'Wishlist Test User',
      email: TEST_USER_EMAIL,
      password: 'SecurePass123!'
    }
  });
  assert.equal(signup.status, 201);

  const unauthenticated = await request(`/api/v1/me/wishlist/${TEST_COURSE_ID}`, {
    method: 'PUT'
  });
  assert.equal(unauthenticated.status, 401);

  const unauthenticatedWishlist = await request('/api/v1/me/wishlist');
  assert.equal(unauthenticatedWishlist.status, 401);

  const invalidId = await request('/api/v1/me/wishlist/not-a-uuid', {
    method: 'PUT',
    token: signup.body.token
  });
  assert.equal(invalidId.status, 400);
  assert.equal(invalidId.body.error.code, 'VALIDATION_ERROR');

  const missingCourse = await request(`/api/v1/me/wishlist/${MISSING_COURSE_ID}`, {
    method: 'PUT',
    token: signup.body.token
  });
  assert.equal(missingCourse.status, 404);
  assert.equal(missingCourse.body.error.code, 'COURSE_NOT_FOUND');

  const firstAdd = await request(`/api/v1/me/wishlist/${TEST_COURSE_ID}`, {
    method: 'PUT',
    token: signup.body.token
  });
  assert.equal(firstAdd.status, 200);
  assert.equal(firstAdd.body.wishlistItem.courseId, TEST_COURSE_ID);

  const secondAdd = await request(`/api/v1/me/wishlist/${TEST_COURSE_ID}`, {
    method: 'PUT',
    token: signup.body.token
  });
  assert.equal(secondAdd.status, 200);

  const wishlistCount = await prisma.wishlistItem.count({
    where: { userId: signup.body.user.id, courseId: TEST_COURSE_ID }
  });
  assert.equal(wishlistCount, 1);

  const wishlist = await request('/api/v1/me/wishlist', { token: signup.body.token });
  assert.equal(wishlist.status, 200);
  assert.equal(wishlist.body.wishlist.length, 1);
  assert.equal(wishlist.body.wishlist[0].course.id, TEST_COURSE_ID);
  assert.equal(wishlist.body.wishlist[0].course.availableSeats, 5);
  assert.equal(wishlist.body.wishlist[0].course.author.name, 'Wishlist Test Author');

  const removedWishlistItem = await request(`/api/v1/me/wishlist/${TEST_COURSE_ID}`, {
    method: 'DELETE',
    token: signup.body.token
  });
  assert.equal(removedWishlistItem.status, 200);

  const emptyWishlist = await request('/api/v1/me/wishlist', { token: signup.body.token });
  assert.equal(emptyWishlist.status, 200);
  assert.equal(emptyWishlist.body.wishlist.length, 0);

  const missingWishlistItem = await request(`/api/v1/me/wishlist/${TEST_COURSE_ID}`, {
    method: 'DELETE',
    token: signup.body.token
  });
  assert.equal(missingWishlistItem.status, 404);
  assert.equal(missingWishlistItem.body.error.code, 'WISHLIST_ITEM_NOT_FOUND');

  const unauthenticatedCart = await request(`/api/v1/me/cart/${TEST_COURSE_ID}`, {
    method: 'PUT'
  });
  assert.equal(unauthenticatedCart.status, 401);

  const missingCartCourse = await request(`/api/v1/me/cart/${MISSING_COURSE_ID}`, {
    method: 'PUT',
    token: signup.body.token
  });
  assert.equal(missingCartCourse.status, 404);

  const firstCartAdd = await request(`/api/v1/me/cart/${TEST_COURSE_ID}`, {
    method: 'PUT',
    token: signup.body.token
  });
  assert.equal(firstCartAdd.status, 200);
  assert.equal(firstCartAdd.body.cartItem.courseId, TEST_COURSE_ID);

  const secondCartAdd = await request(`/api/v1/me/cart/${TEST_COURSE_ID}`, {
    method: 'PUT',
    token: signup.body.token
  });
  assert.equal(secondCartAdd.status, 200);

  const cartCount = await prisma.cartItem.count({
    where: { userId: signup.body.user.id, courseId: TEST_COURSE_ID }
  });
  assert.equal(cartCount, 1);
});
