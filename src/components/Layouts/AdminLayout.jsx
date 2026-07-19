import { BarChart3, BookOpen, ClipboardList, LayoutDashboard, LogOut, UsersRound } from 'lucide-react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { clearAuthToken } from '../../lib/auth'

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Exams', path: '/admin/exams', icon: ClipboardList },
  { label: 'Students', path: '/admin/students', icon: UsersRound },
  { label: 'Results', path: '/admin/results', icon: BarChart3 },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  function handleLogout() {
    clearAuthToken()
    navigate('/login', { replace: true })
  }

  return (
    <main className="min-h-screen bg-neutral-primary-soft lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-0 z-30 border-b border-default bg-neutral-primary lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-4 py-4 lg:block">
          <button type="button" onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-3 text-left">
            <span className="flex size-10 items-center justify-center rounded-base bg-brand text-white">
              <BookOpen className="size-5" />
            </span>
            <span>
              <span className="block text-base font-semibold text-heading">ExamSys Admin</span>
              <span className="block text-xs text-body">Control center</span>
            </span>
          </button>
          <button type="button" onClick={handleLogout} className="rounded-base border border-default p-2 text-heading lg:hidden">
            <LogOut className="size-4" />
          </button>
        </div>

        <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:block lg:space-y-2 lg:overflow-visible lg:pb-0">
          {navItems.map((item) => {
            const active = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className={`inline-flex min-w-max items-center gap-2 rounded-base px-3 py-2 text-sm font-medium lg:w-full ${
                  active ? 'bg-brand text-white' : 'text-heading hover:bg-neutral-secondary-soft'
                }`}
              >
                <item.icon className="size-4" />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="mt-auto hidden p-4 lg:block">
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex w-full items-center justify-center gap-2 rounded-base border border-default bg-neutral-primary px-3 py-2 text-sm font-medium text-heading hover:bg-neutral-secondary-soft"
          >
            <LogOut className="size-4" />
            Logout
          </button>
        </div>
      </aside>

      <section className="min-w-0 px-4 py-6 lg:px-8">
        <Outlet />
      </section>
    </main>
  )
}
