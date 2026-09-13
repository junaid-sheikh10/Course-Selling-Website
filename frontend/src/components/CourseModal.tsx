import { useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addCourseToCart, addCourseToWishlist } from '../api/course-actions'
import type { Course } from '../types/course'

interface CourseModalProps {
  course: Course
  token: string
  onClose: () => void
}

const euroFormatter = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
})

export function CourseModal({ course, token, onClose }: CourseModalProps) {
  const queryClient = useQueryClient()
  const wishlistMutation = useMutation({
    mutationFn: () => addCourseToWishlist(course.id, token),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
  })
  const cartMutation = useMutation({
    mutationFn: () => addCourseToCart(course.id, token),
  })

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [onClose])

  const error = wishlistMutation.error ?? cartMutation.error
  const successMessage = wishlistMutation.data?.message ?? cartMutation.data?.message

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        aria-labelledby="course-modal-title"
        aria-modal="true"
        className="course-modal"
        role="dialog"
      >
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close">
          ×
        </button>

        <span className="eyebrow">Course details</span>
        <h2 id="course-modal-title">{course.title}</h2>
        <p className="modal-author">Created by {course.author.name}</p>
        <p className="modal-description">{course.description}</p>

        <div className="course-facts">
          <div>
            <span>Price</span>
            <strong>{euroFormatter.format(course.priceInCents / 100)}</strong>
          </div>
          <div>
            <span>Availability</span>
            <strong>{course.isFull ? 'Course full' : `${course.availableSeats} seats left`}</strong>
          </div>
          <div>
            <span>Enrolled</span>
            <strong>{course.occupiedSeats} / {course.seatLimit}</strong>
          </div>
        </div>

        <div className="modal-actions">
          <button
            className="button button-secondary"
            disabled={wishlistMutation.isPending}
            type="button"
            onClick={() => {
              cartMutation.reset()
              wishlistMutation.mutate()
            }}
          >
            {wishlistMutation.isPending ? 'Adding…' : 'Wishlist'}
          </button>
          <button
            className="button button-primary"
            disabled={course.isFull || cartMutation.isPending}
            type="button"
            onClick={() => {
              wishlistMutation.reset()
              cartMutation.mutate()
            }}
          >
            {cartMutation.isPending ? 'Adding…' : 'Add to cart'}
          </button>
        </div>

        {successMessage && <p className="action-feedback action-success">{successMessage}</p>}
        {error && (
          <p className="action-feedback action-error" role="alert">
            {error instanceof Error ? error.message : 'The action could not be completed'}
          </p>
        )}
      </section>
    </div>
  )
}
