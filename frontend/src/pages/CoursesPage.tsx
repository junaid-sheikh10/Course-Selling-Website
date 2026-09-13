import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { getCourses } from '../api/courses'
import { CourseCard } from '../components/CourseCard'
import { CourseModal } from '../components/CourseModal'
import { useAuth } from '../hooks/useAuth'
import type { Course } from '../types/course'

export function CoursesPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { isAuthenticated, isLoading: isAuthLoading, token } = useAuth()
  const coursesQuery = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  })
  const selectedCourse = coursesQuery.data?.courses.find(
    (course) => course.id === searchParams.get('course'),
  )

  function exploreCourse(course: Course) {
    if (isAuthLoading) return
    if (!isAuthenticated) {
      navigate(`/auth?course=${encodeURIComponent(course.id)}`)
      return
    }

    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('course', course.id)
    setSearchParams(nextParams)
  }

  const closeModal = useCallback(() => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete('course')
    setSearchParams(nextParams, { replace: true })
  }, [searchParams, setSearchParams])

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
              <CourseCard
                key={course.id}
                course={course}
                disabled={isAuthLoading}
                onExplore={exploreCourse}
              />
            ))}
          </div>
        )}
      </div>

      {isAuthenticated && token && selectedCourse && (
        <CourseModal course={selectedCourse} token={token} onClose={closeModal} />
      )}
    </section>
  )
}
