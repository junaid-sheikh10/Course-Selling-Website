import { useQuery } from '@tanstack/react-query'
import { getCourses } from '../api/courses'
import { CourseCard } from '../components/CourseCard'

export function CoursesPage() {
  const coursesQuery = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  })

  return (
    <section className="page-section">
      <div className="container">
        <div className="page-heading">
          <span className="eyebrow">Course catalogue</span>
          <h1>Choose what you want to learn next.</h1>
          <p>Browse every published course and see current seat availability.</p>
        </div>

        {coursesQuery.isPending && <p className="status-panel">Loading courses…</p>}
        {coursesQuery.isError && (
          <div className="status-panel status-panel-error">
            <p>We could not load the courses.</p>
            <button className="button button-secondary" onClick={() => coursesQuery.refetch()}>
              Try again
            </button>
          </div>
        )}
        {coursesQuery.data?.courses.length === 0 && (
          <p className="status-panel">No courses are available yet.</p>
        )}
        {coursesQuery.data && coursesQuery.data.courses.length > 0 && (
          <div className="course-grid">
            {coursesQuery.data.courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
