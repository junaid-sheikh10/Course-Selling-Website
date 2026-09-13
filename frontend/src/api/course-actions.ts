import type { CourseActionResponse } from '../types/course-action'
import { apiRequest } from './client'

export function addCourseToWishlist(courseId: string, token: string) {
  return apiRequest<CourseActionResponse>(
    `/me/wishlist/${courseId}`,
    { method: 'PUT' },
    token,
  )
}

export function addCourseToCart(courseId: string, token: string) {
  return apiRequest<CourseActionResponse>(
    `/me/cart/${courseId}`,
    { method: 'PUT' },
    token,
  )
}
