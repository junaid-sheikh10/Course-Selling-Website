import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getProfile, login as loginRequest, signup as signupRequest } from '../api/auth'
import type { AuthResponse, LoginInput, SignupInput, User } from '../types/auth'
import { AuthContext, type AuthContextValue } from './AuthContext'

const TOKEN_KEY = 'coursebase.authToken'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(() => Boolean(token))

  const clearAuth = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
    setIsLoading(false)
  }, [])

  const applyAuth = useCallback((result: AuthResponse) => {
    localStorage.setItem(TOKEN_KEY, result.token)
    setToken(result.token)
    setUser(result.user)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!token) return

    let cancelled = false

    getProfile(token)
      .then(({ user: profile }) => {
        if (!cancelled) setUser(profile)
      })
      .catch(() => {
        if (!cancelled) clearAuth()
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [clearAuth, token])

  const login = useCallback(async (input: LoginInput) => {
    applyAuth(await loginRequest(input))
  }, [applyAuth])

  const signup = useCallback(async (input: SignupInput) => {
    applyAuth(await signupRequest(input))
  }, [applyAuth])

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    isLoading,
    isAuthenticated: Boolean(user && token),
    login,
    signup,
    logout: clearAuth,
  }), [clearAuth, isLoading, login, signup, token, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
