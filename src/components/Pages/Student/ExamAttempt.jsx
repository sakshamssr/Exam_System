import { useEffect, useState } from 'react'
import { ArrowLeft, LoaderCircle, Send } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getExam, submitExam } from '../../../api/examApi'

export default function ExamAttempt() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [exam, setExam] = useState(null)
  const [answers, setAnswers] = useState({})
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function loadExam() {
      try {
        const res = await getExam(id)
        setExam(res.data.data)
      } catch (err) {
        setMessage(err.response?.data?.message || 'Unable to load exam.')
      } finally {
        setLoading(false)
      }
    }
    loadExam()
  }, [id])

  function handleAnswer(questionId, selectedAnswer) {
    setAnswers({ ...answers, [questionId]: selectedAnswer })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')

    const payload = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
      questionId,
      selectedAnswer,
    }))

    setSubmitting(true)
    try {
      await submitExam(id, payload)
      navigate('/student/results', { replace: true })
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to submit exam.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-body">
        <LoaderCircle className="size-4 animate-spin" />
        Loading exam
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/student/exams" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-heading hover:underline">
        <ArrowLeft className="size-4" />
        Back to exams
      </Link>

      {message ? <div className="mb-6 rounded-base border border-default bg-neutral-primary px-4 py-3 text-sm text-heading shadow-xs">{message}</div> : null}

      {exam ? (
        <form className="rounded-base border border-default bg-neutral-primary p-6 shadow-xs" onSubmit={handleSubmit}>
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-heading">{exam.title}</h1>
            <p className="mt-2 text-sm text-body">{exam.subject} • {exam.durationMinutes} minutes</p>
          </div>

          <div className="space-y-5">
            {(exam.questions || []).map((question, index) => (
              <section key={question._id} className="rounded-base border border-default bg-neutral-secondary-soft p-4">
                <h2 className="font-medium text-heading">{index + 1}. {question.questionText}</h2>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {(question.options || []).map((option) => (
                    <label key={option} className="flex items-center gap-2 rounded-base border border-default bg-neutral-primary px-3 py-2 text-sm text-heading">
                      <input
                        type="radio"
                        name={question._id}
                        value={option}
                        checked={answers[question._id] === option}
                        onChange={() => handleAnswer(question._id, option)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <button disabled={submitting} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-base bg-brand px-4 py-2.5 text-sm font-medium text-white disabled:opacity-70">
            {submitting ? <LoaderCircle className="size-4 animate-spin" /> : <Send className="size-4" />}
            Submit exam
          </button>
        </form>
      ) : null}
    </div>
  )
}
