import type { CoursesResponse } from '../types/course'
import { apiRequest } from './client'

export function getCourses() {
  return apiRequest<CoursesResponse>('/courses')
}
