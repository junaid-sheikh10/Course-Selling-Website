import { Link, NavLink } from 'react-router'

export function AppHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" to="/" aria-label="Coursebase home">
          <span className="brand-mark" aria-hidden="true">C</span>
          <span>Coursebase</span>
        </Link>

        <nav className="main-nav" aria-label="Main navigation">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/courses">Courses</NavLink>
        </nav>
      </div>
    </header>
  )
}
