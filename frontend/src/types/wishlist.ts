import type { Course } from './course'

export interface WishlistEntry {
  addedAt: string
  course: Course
}

export interface WishlistResponse {
  wishlist: WishlistEntry[]
}

export interface RemoveWishlistResponse {
  message: string
}
