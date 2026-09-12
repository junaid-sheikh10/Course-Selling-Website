import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <section className="page-section">
      <div className="container narrow-content">
        <span className="eyebrow">404</span>
        <h1>We could not find that page.</h1>
        <Link className="button button-primary" to="/">Return home</Link>
      </div>
    </section>
  )
}
