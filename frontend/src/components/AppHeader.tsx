import { useQuery } from '@tanstack/react-query'
import { Link, NavLink } from 'react-router'
import { getWishlist } from '../api/wishlist'
import { useAuth } from '../hooks/useAuth'

export function AppHeader() {
  const { isAuthenticated, isLoading, logout, token, user } = useAuth()
  const wishlistQuery = useQuery({
    queryKey: ['wishlist', user?.id],
    queryFn: () => {
      if (!token) throw new Error('Authentication required')
      return getWishlist(token)
    },
    enabled: isAuthenticated && Boolean(token && user),
  })
  const wishlistCount = wishlistQuery.data?.wishlist.length ?? 0

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" to="/" aria-label="Coursebase home">
          <span className="brand-mark" aria-hidden="true">C</span>
          <span>Coursebase</span>
        </Link>

        <div className="header-actions">
          <nav className="main-nav" aria-label="Main navigation">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/courses">Courses</NavLink>
          </nav>

          {!isLoading && (
            isAuthenticated ? (
              <div className="account-menu">
                <span>Hi, {user?.name.split(' ')[0]}</span>
                <button type="button" onClick={logout}>Log out</button>
              </div>
            ) : (
              <Link className="button button-primary header-sign-in" to="/auth">
                Log in
              </Link>
            )
          )}
        </div>
      </div>

      {!isLoading && isAuthenticated && (
        <nav className="account-nav" aria-label="Account navigation">
          <div className="container account-nav-inner">
            <NavLink to="/my-courses">My Courses</NavLink>
            <NavLink to="/courses">All Courses</NavLink>
            <NavLink to="/profile">Profile</NavLink>
            <NavLink to="/wishlist">
              Wishlist
              <span className="nav-count" aria-label={`${wishlistCount} wishlist items`}>
                {wishlistCount}
              </span>
            </NavLink>
            <NavLink to="/cart">Cart</NavLink>
          </div>
        </nav>
      )}
    </header>
  )
}
