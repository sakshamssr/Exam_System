import { useEffect, useState } from 'react'
import { LoaderCircle, Trophy } from 'lucide-react'
import { getMyResults } from '../../../api/resultApi'

export default function Results() {
  const [results, setResults] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadResults() {
      setLoading(true)
      try {
        const res = await getMyResults()
        setResults(res.data.data || [])
      } catch (err) {
        setMessage(err.response?.data?.message || 'Unable to load results.')
      } finally {
        setLoading(false)
      }
    }
    loadResults()
  }, [])

  return (
    <div className="mx-auto max-w-5xl">
      <section className="rounded-base border border-default bg-neutral-primary p-6 shadow-xs">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-base bg-brand text-white">
            <Trophy className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-heading">My results</h1>
            <p className="text-sm text-body">Submitted exam attempts and scores.</p>
          </div>
        </div>

        {message ? <div className="mb-4 rounded-base border border-default bg-neutral-secondary-soft px-3 py-2 text-sm text-heading">{message}</div> : null}

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-body">
            <LoaderCircle className="size-4 animate-spin" />
            Loading results
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((result) => (
              <article key={result._id} className="rounded-base border border-default bg-neutral-secondary-soft p-4">
                <h2 className="font-medium text-heading">{result.exam?.title}</h2>
                <p className="mt-1 text-sm text-body">{result.exam?.subject}</p>
                <p className="mt-2 text-sm font-medium text-heading">Score: {result.score}/{result.totalMarks} ({result.percentage}%)</p>
              </article>
            ))}
            {!results.length ? <p className="text-sm text-body">No results yet.</p> : null}
          </div>
        )}
      </section>
    </div>
  )
}
