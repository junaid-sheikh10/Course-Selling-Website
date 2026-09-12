const bcrypt = require('bcryptjs');
const prisma = require('../src/db');

const SEED_PASSWORD = 'Author123!';

const authorData = [
  {
    email: 'elena.author@example.com',
    name: 'Elena Fischer',
    birthYear: 1990
  },
  {
    email: 'marco.author@example.com',
    name: 'Marco Rossi',
    birthYear: 1987
  }
];

const courseData = [
  {
    id: '10000000-0000-4000-8000-000000000001',
    title: 'JavaScript Fundamentals',
    description: 'Learn variables, functions, objects, arrays, and asynchronous JavaScript.',
    priceInCents: 4900,
    seatLimit: 5,
    authorIndex: 0
  },
  {
    id: '10000000-0000-4000-8000-000000000002',
    title: 'React from Scratch',
    description: 'Build interactive interfaces with components, hooks, and reusable state patterns.',
    priceInCents: 6900,
    seatLimit: 12,
    authorIndex: 0
  },
  {
    id: '10000000-0000-4000-8000-000000000003',
    title: 'Node.js API Development',
    description: 'Design and build maintainable REST APIs with Node.js and Express.',
    priceInCents: 7900,
    seatLimit: 20,
    authorIndex: 1
  },
  {
    id: '10000000-0000-4000-8000-000000000004',
    title: 'Practical UI Design',
    description: 'Create clear layouts, consistent visual systems, and accessible interfaces.',
    priceInCents: 3900,
    seatLimit: 10,
    authorIndex: 1
  }
];

async function seed() {
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);
  const authors = [];

  for (const author of authorData) {
    authors.push(await prisma.user.upsert({
      where: { email: author.email },
      update: { ...author, passwordHash, role: 'AUTHOR' },
      create: { ...author, passwordHash, role: 'AUTHOR' }
    }));
  }

  for (const { authorIndex, ...course } of courseData) {
    await prisma.course.upsert({
      where: { id: course.id },
      update: { ...course, authorId: authors[authorIndex].id },
      create: { ...course, authorId: authors[authorIndex].id }
    });
  }

  const courses = await prisma.course.findMany({
    include: { author: { select: { name: true } } },
    orderBy: { title: 'asc' }
  });

  console.table(courses.map(course => ({
    title: course.title,
    author: course.author.name,
    price: `EUR ${(course.priceInCents / 100).toFixed(2)}`,
    seats: course.seatLimit
  })));
  console.log(`Seeded ${authors.length} authors and ${courses.length} courses.`);
}

seed()
  .catch(error => {
    console.error('Database seed failed:', error.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
