export interface CourseAuthor {
  id: string
  name: string
}

export interface Course {
  id: string
  title: string
  description: string
  priceInCents: number
  currency: 'EUR'
  seatLimit: number
  occupiedSeats: number
  availableSeats: number
  isFull: boolean
  author: CourseAuthor
  createdAt: string
  updatedAt: string
}

export interface CoursesResponse {
  courses: Course[]
}
