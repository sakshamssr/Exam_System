import { useEffect, useState } from 'react'
import { BarChart3, LoaderCircle, Trophy } from 'lucide-react'
import { getAllResults } from '../../../api/resultApi'

export default function AdminResults() {
  const [results, setResults] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllResults()
      .then((res) => setResults(res.data.data || []))
      .catch((err) => setMessage(err.response?.data?.message || 'Unable to load results.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-heading">All results</h1>
        <p className="mt-1 text-sm text-body">Review scores from all submitted exam attempts.</p>
      </div>

      {message ? <div className="mb-5 rounded-base border border-default bg-neutral-primary px-4 py-3 text-sm text-heading shadow-xs">{message}</div> : null}

      <section className="rounded-base border border-default bg-neutral-primary p-6 shadow-xs">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-base bg-brand text-white">
            <Trophy className="size-5" />
          </div>
          <div>
            <h2 className="font-semibold text-heading">Submitted results</h2>
            <p className="text-sm text-body">{results.length} total attempt{results.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-body">
            <LoaderCircle className="size-4 animate-spin" />
            Loading results
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((result) => (
              <article key={result._id} className="rounded-base border border-default bg-neutral-secondary-soft p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-medium text-heading">{result.exam?.title || 'Untitled exam'}</h3>
                    <p className="mt-1 text-sm text-body">{result.exam?.subject}</p>
                    <p className="mt-1 text-sm text-body">
                      Student: {result.student?.firstName || result.student?.name?.firstName || 'Unknown'} {result.student?.lastName || result.student?.name?.lastName || ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="size-4 text-body" />
                    <span className="text-sm font-medium text-heading">
                      {result.score}/{result.totalMarks} ({result.percentage}%)
                    </span>
                  </div>
                </div>
              </article>
            ))}
            {!results.length ? <p className="text-sm text-body">No results submitted yet.</p> : null}
          </div>
        )}
      </section>
    </div>
  )
}
