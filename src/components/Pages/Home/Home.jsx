import { useEffect, useState } from 'react'
import { BarChart3, CalendarDays, CheckCircle2, ClipboardList, Medal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getExams } from '../../../api/examApi'
import { decodeJwtPayload } from '../../../lib/auth'

export default function Home() {
  const navigate = useNavigate()
  const profile = decodeJwtPayload()
  const [exams, setExams] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadExams() {
      try {
        const res = await getExams()
        setExams(res.data.data || [])
      } catch (err) {
        setMessage(err.response?.data?.message || 'Unable to load dashboard.')
      }
    }
    loadExams()
  }, [])

  const firstName = profile?.firstName || profile?.name?.firstName || 'Student'

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-base border border-default bg-neutral-primary p-6 shadow-xs">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-fg-brand">Student dashboard</p>
        <h1 className="text-3xl font-bold text-heading">Hello, {firstName}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-body">
          Review assigned exams, continue attempts, update your student profile, and track submitted results from the sidebar.
        </p>
        {message ? <p className="mt-4 text-sm text-red-600">{message}</p> : null}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats(exams).map((stat) => (
          <article key={stat.label} className="rounded-base border border-default bg-neutral-primary p-5 shadow-xs">
            <div className="mb-4 flex size-10 items-center justify-center rounded-base bg-neutral-secondary-soft text-heading">
              <stat.icon className="size-5" />
            </div>
            <p className="text-2xl font-semibold text-heading">{stat.value}</p>
            <p className="mt-1 text-sm text-body">{stat.label}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <button type="button" onClick={() => navigate('/student/exams')} className="rounded-base border border-default bg-neutral-primary p-6 text-left shadow-xs hover:bg-neutral-secondary-soft">
          <ClipboardList className="mb-4 size-6 text-heading" />
          <h2 className="text-lg font-semibold text-heading">Attempt exams</h2>
          <p className="mt-2 text-sm text-body">Open the exam catalog and start a published exam.</p>
        </button>
        <button type="button" onClick={() => navigate('/student/results')} className="rounded-base border border-default bg-neutral-primary p-6 text-left shadow-xs hover:bg-neutral-secondary-soft">
          <BarChart3 className="mb-4 size-6 text-heading" />
          <h2 className="text-lg font-semibold text-heading">View results</h2>
          <p className="mt-2 text-sm text-body">Check submitted attempts and scores.</p>
        </button>
      </section>
    </div>
  )
}

function stats(exams) {
  return [
    { label: 'Available exams', value: String(exams.length).padStart(2, '0'), icon: CalendarDays },
    { label: 'Published exams', value: String(exams.filter((exam) => exam.status === 'published').length).padStart(2, '0'), icon: CheckCircle2 },
    { label: 'Pending tasks', value: String(exams.length).padStart(2, '0'), icon: ClipboardList },
    { label: 'Average score', value: '84%', icon: Medal },
  ]
}
