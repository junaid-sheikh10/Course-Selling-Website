export interface CourseActionItem {
  userId: string
  courseId: string
  createdAt: string
}

export interface CourseActionResponse {
  message: string
  wishlistItem?: CourseActionItem
  cartItem?: CourseActionItem
}
