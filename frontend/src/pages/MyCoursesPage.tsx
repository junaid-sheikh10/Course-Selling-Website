import { Link } from 'react-router'

export function MyCoursesPage() {
  return (
    <section className="page-section">
      <div className="container">
        <div className="page-heading account-page-heading">
          <span className="eyebrow">Your learning</span>
          <h1>My Courses.</h1>
          <p>Your purchased courses will be collected here.</p>
        </div>
        <div className="empty-state">
          <h2>No courses to show yet.</h2>
          <p>When you complete a course purchase, it will appear in this area.</p>
          <Link className="button button-primary" to="/courses">Browse courses</Link>
        </div>
      </div>
    </section>
  )
}
