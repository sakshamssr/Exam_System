import { useEffect, useState } from 'react'
import { BookOpen, LoaderCircle, Plus, Trash2 } from 'lucide-react'
import { createExam, deleteExam, getExams, updateExam } from '../../../api/examApi'

const emptyExam = {
  title: '',
  subject: '',
  startsAt: '',
  durationMinutes: 30,
  status: 'published',
  questions: [
    { questionText: '', options: ['', '', '', ''], correctAnswer: '', marks: 1 },
    { questionText: '', options: ['', '', '', ''], correctAnswer: '', marks: 1 },
    { questionText: '', options: ['', '', '', ''], correctAnswer: '', marks: 1 },
  ],
}

export default function AdminExams() {
  const [exams, setExams] = useState([])
  const [examData, setExamData] = useState(emptyExam)
  const [editingExamId, setEditingExamId] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadExams()
  }, [])

  function loadExams() {
    setLoading(true)
    getExams()
      .then((res) => setExams(res.data.data || []))
      .catch((err) => setMessage(err.response?.data?.message || 'Unable to load exams.'))
      .finally(() => setLoading(false))
  }

  function handleExamChange(event) {
    const { name, value } = event.target
    setExamData({ ...examData, [name]: value })
  }

  function handleQuestionChange(questionIndex, field, value) {
    const questions = examData.questions.map((question, index) => (
      index === questionIndex ? { ...question, [field]: value } : question
    ))
    setExamData({ ...examData, questions })
  }

  function handleOptionChange(questionIndex, optionIndex, value) {
    const questions = examData.questions.map((question, index) => {
      if (index !== questionIndex) return question
      const options = question.options.map((option, currentIndex) => currentIndex === optionIndex ? value : option)
      return { ...question, options }
    })
    setExamData({ ...examData, questions })
  }

  function validate(data) {
    if (!data.title.trim()) return 'Exam title is required'
    if (!data.subject.trim()) return 'Subject is required'
    if (!data.startsAt) return 'Start date and time are required'
    if (!data.durationMinutes) return 'Duration is required'
    if (data.questions.some((question) => !question.questionText.trim() || question.options.some((option) => !option.trim()) || !question.correctAnswer.trim())) {
      return 'All questions, options, and correct answers are required'
    }
    return ''
  }

  function handleSubmit(event) {
    event.preventDefault()
    const formError = validate(examData)
    setError(formError)
    setMessage('')
    if (formError) return
    setSaving(true)
    const request = editingExamId ? updateExam(editingExamId, examData) : createExam(examData)
    request
      .then((res) => {
        setMessage(res.data.message || 'Exam saved.')
        setExamData(emptyExam)
        setEditingExamId('')
        loadExams()
      })
      .catch((err) => setMessage(err.response?.data?.message || 'Unable to save exam.'))
      .finally(() => setSaving(false))
  }

  function startEditExam(exam) {
    setEditingExamId(exam._id)
    setExamData({
      title: exam.title || '',
      subject: exam.subject || '',
      startsAt: exam.startsAt ? new Date(exam.startsAt).toISOString().slice(0, 16) : '',
      durationMinutes: exam.durationMinutes || 30,
      status: exam.status || 'published',
      questions: (exam.questions || []).map((question) => ({
        questionText: question.questionText || '',
        options: question.options || ['', '', '', ''],
        correctAnswer: question.correctAnswer || '',
        marks: question.marks || 1,
      })),
    })
  }

  function handleDeleteExam(examId) {
    deleteExam(examId)
      .then((res) => {
        setMessage(res.data.message || 'Exam deleted.')
        loadExams()
      })
      .catch((err) => setMessage(err.response?.data?.message || 'Unable to delete exam.'))
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[420px_1fr]">
      <form className="rounded-base border border-default bg-neutral-primary p-6 shadow-xs" onSubmit={handleSubmit}>
        <h1 className="text-xl font-semibold text-heading">{editingExamId ? 'Edit exam' : 'Create exam'}</h1>
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        {message ? <p className="mt-2 text-sm text-heading">{message}</p> : null}
        <div className="mt-5 space-y-4">
          <Input id="title" label="Title" icon={BookOpen} value={examData.title} onChange={handleExamChange} />
          <Input id="subject" label="Subject" icon={BookOpen} value={examData.subject} onChange={handleExamChange} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input id="startsAt" label="Starts at" type="datetime-local" icon={BookOpen} value={examData.startsAt} onChange={handleExamChange} />
            <Input id="durationMinutes" label="Minutes" type="number" icon={BookOpen} value={examData.durationMinutes} onChange={handleExamChange} />
          </div>
          <select name="status" value={examData.status} onChange={handleExamChange} className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="closed">Closed</option>
          </select>
          {examData.questions.map((question, questionIndex) => (
            <div key={questionIndex} className="rounded-base border border-default bg-neutral-secondary-soft p-4">
              <input value={question.questionText} onChange={(event) => handleQuestionChange(questionIndex, 'questionText', event.target.value)} placeholder={`Question ${questionIndex + 1}`} className="mb-3 block w-full rounded-base border border-default-medium bg-neutral-primary px-3 py-2 text-sm text-heading" />
              <div className="grid gap-2 sm:grid-cols-2">
                {question.options.map((option, optionIndex) => (
                  <input key={optionIndex} value={option} onChange={(event) => handleOptionChange(questionIndex, optionIndex, event.target.value)} placeholder={`Option ${optionIndex + 1}`} className="block w-full rounded-base border border-default-medium bg-neutral-primary px-3 py-2 text-sm text-heading" />
                ))}
              </div>
              <input value={question.correctAnswer} onChange={(event) => handleQuestionChange(questionIndex, 'correctAnswer', event.target.value)} placeholder="Correct answer" className="mt-3 block w-full rounded-base border border-default-medium bg-neutral-primary px-3 py-2 text-sm text-heading" />
            </div>
          ))}
          <button disabled={saving} className="inline-flex w-full items-center justify-center gap-2 rounded-base bg-brand px-4 py-2.5 text-sm font-medium text-white disabled:opacity-70">
            {saving ? <LoaderCircle className="size-4 animate-spin" /> : <Plus className="size-4" />}
            {editingExamId ? 'Update exam' : 'Create exam'}
          </button>
        </div>
      </form>

      <section className="rounded-base border border-default bg-neutral-primary p-6 shadow-xs">
        <h2 className="text-xl font-semibold text-heading">Exams</h2>
        <div className="mt-5 space-y-3">
          {loading ? <p className="text-sm text-body">Loading exams...</p> : exams.map((exam) => (
            <article key={exam._id} className="rounded-base border border-default bg-neutral-secondary-soft p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-medium text-heading">{exam.title}</h3>
                  <p className="mt-1 text-sm text-body">{exam.subject} - {exam.durationMinutes} minutes - {exam.status}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => startEditExam(exam)} className="rounded-base border border-default bg-neutral-primary px-3 py-2 text-sm text-heading">Edit</button>
                  <button type="button" onClick={() => handleDeleteExam(exam._id)} className="rounded-base border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

function Input({ id, label, icon: Icon, type = 'text', value, onChange }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2.5 block text-sm font-medium text-heading">{label}</label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-body" />
        <input id={id} name={id} type={type} value={value} onChange={onChange} className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-10 py-2.5 text-sm text-heading shadow-xs" />
      </div>
    </div>
  )
}
