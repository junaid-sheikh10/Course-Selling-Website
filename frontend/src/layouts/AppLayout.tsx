import { Outlet } from 'react-router'
import { AppHeader } from '../components/AppHeader'

export function AppLayout() {
  return (
    <div className="app-shell">
      <AppHeader />
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container">Coursebase · Learn at your pace</div>
      </footer>
    </div>
  )
}
