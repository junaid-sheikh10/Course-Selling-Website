import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router'
import { ApiError } from '../api/client'
import { useAuth } from '../hooks/useAuth'

export function AuthPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { isAuthenticated, isLoading, login, signup } = useAuth()
  const mode = searchParams.get('mode') === 'signup' ? 'signup' : 'login'
  const courseId = searchParams.get('course')
  const requestedDestination = searchParams.get('returnTo')
  const safeDestination = requestedDestination?.startsWith('/')
    && !requestedDestination.startsWith('//')
    ? requestedDestination
    : null
  const destination = courseId
    ? `/courses?course=${encodeURIComponent(courseId)}`
    : safeDestination ?? '/courses'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [birthYear, setBirthYear] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isLoading) {
    return <p className="status-panel auth-loading">Checking your account…</p>
  }
  if (isAuthenticated) return <Navigate to={destination} replace />

  function changeMode(nextMode: 'login' | 'signup') {
    const nextParams = new URLSearchParams(searchParams)
    if (nextMode === 'signup') nextParams.set('mode', 'signup')
    else nextParams.delete('mode')
    setSearchParams(nextParams, { replace: true })
    setError('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      if (mode === 'login') {
        await login({ email, password })
      } else {
        await signup({
          name,
          email,
          password,
          ...(birthYear ? { birthYear: Number(birthYear) } : {}),
        })
      }
      navigate(destination, { replace: true })
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : 'Something went wrong. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="auth-section">
      <div className="auth-card">
        <div className="auth-heading">
          <span className="eyebrow">Your learning account</span>
          <h1>{mode === 'login' ? 'Welcome back.' : 'Create your account.'}</h1>
          <p>
            {mode === 'login'
              ? 'Sign in to explore course details and save your choices.'
              : 'Join Coursebase to build your wishlist and course collection.'}
          </p>
        </div>

        <div className="auth-tabs" aria-label="Authentication options">
          <button
            className={mode === 'login' ? 'active' : ''}
            type="button"
            onClick={() => changeMode('login')}
          >
            Log in
          </button>
          <button
            className={mode === 'signup' ? 'active' : ''}
            type="button"
            onClick={() => changeMode('signup')}
          >
            Sign up
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <label>
              Name
              <input
                autoComplete="name"
                minLength={2}
                maxLength={80}
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>
          )}

          <label>
            Email
            <input
              autoComplete="email"
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label>
            Password
            <input
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              minLength={mode === 'signup' ? 8 : 1}
              maxLength={72}
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {mode === 'signup' && (
            <label>
              Birth year <span>(optional)</span>
              <input
                inputMode="numeric"
                min="1900"
                max={new Date().getFullYear()}
                type="number"
                value={birthYear}
                onChange={(event) => setBirthYear(event.target.value)}
              />
            </label>
          )}

          {error && <p className="form-error" role="alert">{error}</p>}

          <button className="button button-primary auth-submit" disabled={isSubmitting}>
            {isSubmitting
              ? 'Please wait…'
              : mode === 'login' ? 'Log in' : 'Create account'}
          </button>
        </form>
      </div>
    </section>
  )
}
