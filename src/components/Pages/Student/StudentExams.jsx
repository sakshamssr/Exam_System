import { useEffect, useState } from 'react'
import { CalendarDays, Clock3, LoaderCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getExams } from '../../../api/examApi'

export default function StudentExams() {
  const navigate = useNavigate()
  const [exams, setExams] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadExams() {
      setLoading(true)
      try {
        const res = await getExams()
        setExams(res.data.data || [])
      } catch (err) {
        setMessage(err.response?.data?.message || 'Unable to load exams.')
      } finally {
        setLoading(false)
      }
    }
    loadExams()
  }, [])

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-heading">Available exams</h1>
        <p className="mt-1 text-sm text-body">Choose a published exam and submit your answers.</p>
      </div>

      {message ? <div className="mb-5 rounded-base border border-default bg-neutral-primary px-4 py-3 text-sm text-heading shadow-xs">{message}</div> : null}

      <section className="rounded-base border border-default bg-neutral-primary p-6 shadow-xs">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-body">
            <LoaderCircle className="size-4 animate-spin" />
            Loading exams
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {exams.map((exam) => (
              <article key={exam._id} className="rounded-base border border-default bg-neutral-secondary-soft p-4">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold text-heading">{exam.title}</h2>
                    <p className="mt-1 text-sm text-body">{exam.subject}</p>
                  </div>
                  <span className="rounded-base bg-neutral-primary px-2 py-1 text-xs font-medium text-heading">{exam.status}</span>
                </div>
                <div className="space-y-2 text-sm text-body">
                  <p className="flex items-center gap-2"><Clock3 className="size-4" /> {exam.durationMinutes} minutes</p>
                  <p className="flex items-center gap-2"><CalendarDays className="size-4" /> {exam.startsAt ? new Date(exam.startsAt).toLocaleString() : 'Schedule pending'}</p>
                </div>
                <button type="button" onClick={() => navigate(`/student/exams/${exam._id}`)} className="mt-4 inline-flex w-full items-center justify-center rounded-base bg-brand px-3 py-2 text-sm font-medium text-white">
                  Start exam
                </button>
              </article>
            ))}
            {!exams.length ? <p className="text-sm text-body">No exams are available right now.</p> : null}
          </div>
        )}
      </section>
    </div>
  )
}
