import { Link } from 'react-router'

export function CartPage() {
  return (
    <section className="page-section">
      <div className="container">
        <div className="page-heading account-page-heading">
          <span className="eyebrow">Your selection</span>
          <h1>Cart.</h1>
          <p>Review the courses you plan to purchase.</p>
        </div>
        <div className="empty-state">
          <h2>Your cart summary is coming next.</h2>
          <p>You can already add available courses from their details window.</p>
          <Link className="button button-primary" to="/courses">Explore courses</Link>
        </div>
      </div>
    </section>
  )
}
