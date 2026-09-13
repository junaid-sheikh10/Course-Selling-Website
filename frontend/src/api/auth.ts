import type {
  AuthResponse,
  LoginInput,
  ProfileResponse,
  SignupInput,
} from '../types/auth'
import { apiRequest } from './client'

export function login(input: LoginInput) {
  return apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function signup(input: SignupInput) {
  return apiRequest<AuthResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function getProfile(token: string) {
  return apiRequest<ProfileResponse>('/me', undefined, token)
}
