import { useEffect, useState } from 'react'
import { GraduationCap, LoaderCircle, LockKeyhole, Mail, Plus, UserRound } from 'lucide-react'
import { createStudent, getStudents } from '../../../api/studentApi'

const emptyStudent = {
  firstName: '',
  lastName: '',
  email: '',
  collegeName: '',
  course: '',
  password: '',
}

export default function AdminStudents() {
  const [students, setStudents] = useState([])
  const [studentData, setStudentData] = useState(emptyStudent)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadStudents()
  }, [])

  async function loadStudents() {
    setLoading(true)
    try {
      const res = await getStudents()
      setStudents(res.data.data || [])
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to load students.')
    } finally {
      setLoading(false)
    }
  }

  function handleChange(event) {
    const { name, value } = event.target
    setStudentData({ ...studentData, [name]: value })
  }

  function validate(data) {
    if (!data.firstName.trim()) return 'First name is required'
    if (!data.lastName.trim()) return 'Last name is required'
    if (!data.email.trim()) return 'Email is required'
    if (!data.collegeName.trim()) return 'College name is required'
    if (!data.course.trim()) return 'Course is required'
    if (!data.password) return 'Password is required'
    return ''
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const formError = validate(studentData)
    setError(formError)
    setMessage('')
    if (formError) return
    setSaving(true)
    try {
      const res = await createStudent(studentData)
      setMessage(res.data.message || 'Student created.')
      setStudentData(emptyStudent)
      loadStudents()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to create student.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[420px_1fr]">
      <form className="rounded-base border border-default bg-neutral-primary p-6 shadow-xs" onSubmit={handleSubmit}>
        <h1 className="text-xl font-semibold text-heading">Create student</h1>
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        {message ? <p className="mt-2 text-sm text-heading">{message}</p> : null}
        <div className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input id="firstName" label="First name" icon={UserRound} value={studentData.firstName} onChange={handleChange} />
            <Input id="lastName" label="Last name" icon={UserRound} value={studentData.lastName} onChange={handleChange} />
          </div>
          <Input id="email" label="Email" type="email" icon={Mail} value={studentData.email} onChange={handleChange} />
          <Input id="collegeName" label="College" icon={GraduationCap} value={studentData.collegeName} onChange={handleChange} />
          <Input id="course" label="Course" icon={GraduationCap} value={studentData.course} onChange={handleChange} />
          <Input id="password" label="Password" type="password" icon={LockKeyhole} value={studentData.password} onChange={handleChange} />
          <button disabled={saving} className="inline-flex w-full items-center justify-center gap-2 rounded-base bg-brand px-4 py-2.5 text-sm font-medium text-white disabled:opacity-70">
            {saving ? <LoaderCircle className="size-4 animate-spin" /> : <Plus className="size-4" />}
            Create student
          </button>
        </div>
      </form>

      <section className="rounded-base border border-default bg-neutral-primary p-6 shadow-xs">
        <h2 className="text-xl font-semibold text-heading">Students</h2>
        <div className="mt-5 space-y-3">
          {loading ? <p className="text-sm text-body">Loading students...</p> : students.map((student) => (
            <article key={student._id} className="rounded-base border border-default bg-neutral-secondary-soft p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-medium text-heading">{student.firstName || student.name?.firstName} {student.lastName || student.name?.lastName}</h3>
                  <p className="mt-1 text-sm text-body">{student.email}</p>
                </div>
                <div className="text-sm text-body">
                  <p>{student.collegeName}</p>
                  <p>{student.course}</p>
                </div>
              </div>
            </article>
          ))}
          {!loading && !students.length ? <p className="text-sm text-body">No students registered yet.</p> : null}
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
