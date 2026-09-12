import type { Course } from '../types/course'

interface CourseCardProps {
  course: Course
}

const euroFormatter = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
})

export function CourseCard({ course }: CourseCardProps) {
  return (
    <article className="course-card">
      <div className="course-card-topline">
        <span className="eyebrow">By {course.author.name}</span>
        <span className={course.isFull ? 'seat-status seat-status-full' : 'seat-status'}>
          {course.isFull ? 'Full' : `${course.availableSeats} seats left`}
        </span>
      </div>
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      <div className="course-card-footer">
        <strong>{euroFormatter.format(course.priceInCents / 100)}</strong>
        <span>{course.occupiedSeats} of {course.seatLimit} enrolled</span>
      </div>
    </article>
  )
}
