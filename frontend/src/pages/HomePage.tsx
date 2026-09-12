import { Link } from 'react-router'

export function HomePage() {
  return (
    <section className="hero-section">
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">Learn something useful</span>
          <h1>Courses that move your skills forward.</h1>
          <p>
            Explore practical courses from independent authors, see live seat
            availability, and keep everything you want to learn in one place.
          </p>
          <Link className="button button-primary" to="/courses">
            Browse courses
          </Link>
        </div>

        <div className="hero-panel" aria-label="Coursebase highlights">
          <div>
            <strong>20</strong>
            <span>Maximum learners per course</span>
          </div>
          <div>
            <strong>EUR</strong>
            <span>Clear, simple course pricing</span>
          </div>
          <div>
            <strong>Direct</strong>
            <span>Courses published by their authors</span>
          </div>
        </div>
      </div>
    </section>
  )
}
