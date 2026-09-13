import type { RemoveWishlistResponse, WishlistResponse } from '../types/wishlist'
import { apiRequest } from './client'

export function getWishlist(token: string) {
  return apiRequest<WishlistResponse>('/me/wishlist', undefined, token)
}

export function removeCourseFromWishlist(courseId: string, token: string) {
  return apiRequest<RemoveWishlistResponse>(
    `/me/wishlist/${courseId}`,
    { method: 'DELETE' },
    token,
  )
}
