import type { Course } from '../types/course'

interface CourseCardProps {
  course: Course
  disabled?: boolean
  onExplore: (course: Course) => void
}

const euroFormatter = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
})

export function CourseCard({ course, disabled = false, onExplore }: CourseCardProps) {
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
        <div className="course-card-meta">
          <strong>{euroFormatter.format(course.priceInCents / 100)}</strong>
          <span>{course.occupiedSeats} of {course.seatLimit} enrolled</span>
        </div>
        <button
          className="button button-primary course-explore"
          disabled={disabled}
          type="button"
          onClick={() => onExplore(course)}
        >
          Explore course
        </button>
      </div>
    </article>
  )
}
