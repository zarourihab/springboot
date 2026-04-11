import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function Layout() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      <Sidebar />
      <Topbar />
      <main style={{ marginLeft: '260px', paddingTop: '64px', minHeight: '100vh' }}>
        <div style={{ padding: '24px' }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}