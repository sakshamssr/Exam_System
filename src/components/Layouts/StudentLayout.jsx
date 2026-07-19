import { BookOpen, ClipboardList, Home, LogOut, Trophy, UserRound } from 'lucide-react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { clearAuthToken, decodeJwtPayload } from '../../lib/auth'

const navItems = [
  { label: 'Dashboard', path: '/student/dashboard', icon: Home },
  { label: 'Exams', path: '/student/exams', icon: ClipboardList },
  { label: 'Results', path: '/student/results', icon: Trophy },
  { label: 'Profile', path: '/student/profile', icon: UserRound },
]

export default function StudentLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const profile = decodeJwtPayload()

  function handleLogout() {
    clearAuthToken()
    navigate('/login', { replace: true })
  }

  return (
    <main className="min-h-screen bg-neutral-primary-soft lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-0 z-30 border-b border-default bg-neutral-primary lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-4 py-4 lg:block">
          <button type="button" onClick={() => navigate('/student/dashboard')} className="flex items-center gap-3 text-left">
            <span className="flex size-10 items-center justify-center rounded-base bg-brand text-white">
              <BookOpen className="size-5" />
            </span>
            <span>
              <span className="block text-base font-semibold text-heading">ExamSys</span>
              <span className="block text-xs text-body">Student panel</span>
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
          <div className="mb-3 rounded-base border border-default bg-neutral-secondary-soft p-3">
            <p className="text-sm font-medium text-heading">{profile?.name?.firstName || 'Student'}</p>
            <p className="truncate text-xs text-body">{profile?.email}</p>
          </div>
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
