export type UserRole = 'USER' | 'AUTHOR'

export interface User {
  id: string
  email: string
  name: string
  birthYear: number | null
  role: UserRole
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface ProfileResponse {
  user: User
}

export interface LoginInput {
  email: string
  password: string
}

export interface SignupInput extends LoginInput {
  name: string
  birthYear?: number
}
