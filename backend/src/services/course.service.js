const courses = require('../repositories/course.repository');

function serializeCourse(course) {
  const { authorId, author, _count, ...fields } = course;
  const occupiedSeats = _count.enrollments;
  const availableSeats = Math.max(course.seatLimit - occupiedSeats, 0);

  return {
    ...fields,
    currency: 'EUR',
    occupiedSeats,
    availableSeats,
    isFull: availableSeats === 0,
    author: {
      id: author.id,
      name: author.name
    }
  };
}

async function getAllCourses() {
  return (await courses.findAll()).map(serializeCourse);
}

module.exports = { getAllCourses, serializeCourse };
