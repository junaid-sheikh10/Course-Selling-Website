import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router'
import { getWishlist, removeCourseFromWishlist } from '../api/wishlist'
import { CourseModal } from '../components/CourseModal'
import { useAuth } from '../hooks/useAuth'
import type { Course } from '../types/course'

const euroFormatter = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
})

export function WishlistPage() {
  const queryClient = useQueryClient()
  const { token, user } = useAuth()
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const wishlistQuery = useQuery({
    queryKey: ['wishlist', user?.id],
    queryFn: () => {
      if (!token) throw new Error('Authentication required')
      return getWishlist(token)
    },
  })
  const removeMutation = useMutation({
    mutationFn: (courseId: string) => {
      if (!token) throw new Error('Authentication required')
      return removeCourseFromWishlist(courseId, token)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
  })

  return (
    <section className="page-section">
      <div className="container">
        <div className="page-heading account-page-heading">
          <span className="eyebrow">Saved for later</span>
          <h1>Your wishlist.</h1>
          <p>Keep track of courses you want to return to.</p>
        </div>

        {wishlistQuery.isPending && <p className="status-panel">Loading your wishlist…</p>}
        {wishlistQuery.isError && (
          <div className="status-panel status-panel-error">
            <p>We could not load your wishlist.</p>
            <button className="button button-secondary" onClick={() => wishlistQuery.refetch()}>
              Try again
            </button>
          </div>
        )}
        {wishlistQuery.data?.wishlist.length === 0 && (
          <div className="empty-state">
            <h2>Your wishlist is empty.</h2>
            <p>Explore the catalogue and save courses that interest you.</p>
            <Link className="button button-primary" to="/courses">Browse courses</Link>
          </div>
        )}
        {wishlistQuery.data && wishlistQuery.data.wishlist.length > 0 && (
          <div className="wishlist-list">
            {wishlistQuery.data.wishlist.map(({ course }) => (
              <article className="wishlist-item" key={course.id}>
                <div className="wishlist-item-copy">
                  <div className="course-card-topline">
                    <span className="eyebrow">By {course.author.name}</span>
                    <span className={course.isFull ? 'seat-status seat-status-full' : 'seat-status'}>
                      {course.isFull ? 'Full' : `${course.availableSeats} seats left`}
                    </span>
                  </div>
                  <h2>{course.title}</h2>
                  <p>{course.description}</p>
                </div>
                <div className="wishlist-item-actions">
                  <strong>{euroFormatter.format(course.priceInCents / 100)}</strong>
                  <button
                    className="button button-secondary"
                    type="button"
                    onClick={() => setSelectedCourse(course)}
                  >
                    View course
                  </button>
                  <button
                    className="text-button text-button-danger"
                    disabled={removeMutation.isPending && removeMutation.variables === course.id}
                    type="button"
                    onClick={() => removeMutation.mutate(course.id)}
                  >
                    {removeMutation.isPending && removeMutation.variables === course.id
                      ? 'Removing…'
                      : 'Remove'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {removeMutation.isError && (
          <p className="action-feedback action-error wishlist-error" role="alert">
            {removeMutation.error instanceof Error
              ? removeMutation.error.message
              : 'The course could not be removed'}
          </p>
        )}
      </div>

      {selectedCourse && token && (
        <CourseModal
          course={selectedCourse}
          token={token}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </section>
  )
}
