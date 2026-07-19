import { useEffect, useState } from 'react'
import { BarChart3, ClipboardList, Plus, UsersRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getExams } from '../../../api/examApi'
import { getAllResults } from '../../../api/resultApi'
import { getStudents } from '../../../api/studentApi'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [counts, setCounts] = useState({ exams: 0, students: 0, results: 0 })
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const [examRes, studentRes, resultRes] = await Promise.all([getExams(), getStudents(), getAllResults()])
        setCounts({
          exams: examRes.data.data?.length || 0,
          students: studentRes.data.data?.length || 0,
          results: resultRes.data.data?.length || 0,
        })
      } catch (err) {
        setMessage(err.response?.data?.message || 'Unable to load admin dashboard.')
      }
    }
    loadData()
  }, [])

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-base border border-default bg-neutral-primary p-6 shadow-xs">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-fg-brand">Admin dashboard</p>
        <h1 className="text-3xl font-bold text-heading">Manage the examination system</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-body">
          Use the sidebar to manage exams, create student profiles, and review submitted results.
        </p>
        {message ? <p className="mt-4 text-sm text-red-600">{message}</p> : null}
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Stat label="Exams" value={counts.exams} icon={ClipboardList} />
        <Stat label="Students" value={counts.students} icon={UsersRound} />
        <Stat label="Submitted results" value={counts.results} icon={BarChart3} />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <QuickAction label="Create exam" description="Add questions and publish a new exam." icon={Plus} onClick={() => navigate('/admin/exams')} />
        <QuickAction label="Create student" description="Register a student profile from admin." icon={UsersRound} onClick={() => navigate('/admin/students')} />
        <QuickAction label="Review results" description="Inspect scores from submitted attempts." icon={BarChart3} onClick={() => navigate('/admin/results')} />
      </section>
    </div>
  )
}

function Stat({ label, value, icon: Icon }) {
  return (
    <article className="rounded-base border border-default bg-neutral-primary p-5 shadow-xs">
      <div className="mb-4 flex size-10 items-center justify-center rounded-base bg-neutral-secondary-soft text-heading">
        <Icon className="size-5" />
      </div>
      <p className="text-2xl font-semibold text-heading">{String(value).padStart(2, '0')}</p>
      <p className="mt-1 text-sm text-body">{label}</p>
    </article>
  )
}

function QuickAction({ label, description, icon: Icon, onClick }) {
  return (
    <button type="button" onClick={onClick} className="rounded-base border border-default bg-neutral-primary p-5 text-left shadow-xs hover:bg-neutral-secondary-soft">
      <Icon className="mb-4 size-5 text-heading" />
      <h2 className="font-semibold text-heading">{label}</h2>
      <p className="mt-2 text-sm text-body">{description}</p>
    </button>
  )
}
