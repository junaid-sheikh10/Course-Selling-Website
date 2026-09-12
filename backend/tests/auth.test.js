const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src');
const prisma = require('../src/db');

const TEST_EMAIL = 'auth.integration@example.com';
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

test.before(async () => {
  await prisma.user.deleteMany({ where: { email: TEST_EMAIL } });
  await new Promise((resolve, reject) => {
    server = app.listen(0, '127.0.0.1', resolve);
    server.once('error', reject);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  await prisma.user.deleteMany({ where: { email: TEST_EMAIL } });
  await new Promise(resolve => server.close(resolve));
  await prisma.$disconnect();
});

test('authentication and profile flow', async () => {
  const invalidSignup = await request('/api/v1/auth/signup', {
    method: 'POST',
    body: { name: 'A', email: 'invalid', password: 'short' }
  });
  assert.equal(invalidSignup.status, 400);
  assert.equal(invalidSignup.body.error.code, 'VALIDATION_ERROR');

  const signup = await request('/api/v1/auth/signup', {
    method: 'POST',
    body: {
      name: 'Auth Test User',
      email: TEST_EMAIL.toUpperCase(),
      password: 'SecurePass123!',
      birthYear: 1995
    }
  });
  assert.equal(signup.status, 201);
  assert.equal(signup.body.user.email, TEST_EMAIL);
  assert.equal(signup.body.user.role, 'USER');
  assert.equal(typeof signup.body.token, 'string');
  assert.equal(signup.body.user.passwordHash, undefined);

  const duplicate = await request('/api/v1/auth/signup', {
    method: 'POST',
    body: {
      name: 'Duplicate User',
      email: TEST_EMAIL,
      password: 'SecurePass123!'
    }
  });
  assert.equal(duplicate.status, 409);
  assert.equal(duplicate.body.error.code, 'EMAIL_IN_USE');

  const failedLogin = await request('/api/v1/auth/login', {
    method: 'POST',
    body: { email: TEST_EMAIL, password: 'WrongPassword' }
  });
  assert.equal(failedLogin.status, 401);
  assert.equal(failedLogin.body.error.code, 'INVALID_CREDENTIALS');

  const login = await request('/api/v1/auth/login', {
    method: 'POST',
    body: { email: TEST_EMAIL, password: 'SecurePass123!' }
  });
  assert.equal(login.status, 200);

  const unauthenticatedProfile = await request('/api/v1/me');
  assert.equal(unauthenticatedProfile.status, 401);
  assert.equal(unauthenticatedProfile.body.error.code, 'AUTHENTICATION_REQUIRED');

  const profile = await request('/api/v1/me', { token: login.body.token });
  assert.equal(profile.status, 200);
  assert.equal(profile.body.user.name, 'Auth Test User');

  const updatedProfile = await request('/api/v1/me', {
    method: 'PATCH',
    token: login.body.token,
    body: { name: 'Updated Test User', birthYear: 1996 }
  });
  assert.equal(updatedProfile.status, 200);
  assert.equal(updatedProfile.body.user.name, 'Updated Test User');
  assert.equal(updatedProfile.body.user.birthYear, 1996);

  const authorRegistration = await request('/api/v1/me/author-registration', {
    method: 'POST',
    token: login.body.token
  });
  assert.equal(authorRegistration.status, 200);
  assert.equal(authorRegistration.body.user.role, 'AUTHOR');

  const refreshedProfile = await request('/api/v1/me', { token: login.body.token });
  assert.equal(refreshedProfile.body.user.role, 'AUTHOR');
});
