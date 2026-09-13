import { useAuth } from '../hooks/useAuth'

export function ProfilePage() {
  const { user } = useAuth()

  return (
    <section className="page-section">
      <div className="container">
        <div className="page-heading account-page-heading">
          <span className="eyebrow">Your account</span>
          <h1>Profile.</h1>
          <p>Your personal details and current account role.</p>
        </div>

        {user && (
          <dl className="profile-card">
            <div><dt>Name</dt><dd>{user.name}</dd></div>
            <div><dt>Email</dt><dd>{user.email}</dd></div>
            <div><dt>Birth year</dt><dd>{user.birthYear ?? 'Not provided'}</dd></div>
            <div><dt>Account type</dt><dd>{user.role === 'AUTHOR' ? 'Author' : 'Student'}</dd></div>
          </dl>
        )}
      </div>
    </section>
  )
}
