import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, GraduationCap, LoaderCircle, LockKeyhole, Mail, UserRound } from 'lucide-react'
import { signup } from '../../../api/authApi'
import { saveAuthToken } from '../../../lib/auth'

export default function Register() {
  const navigate = useNavigate()
  const [signupData, setSignupData] = useState({})
  const [error, setError] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setSignupData({ ...signupData, [name]: value })
  }

  function validate(data) {
    const formError = {}

    if (!data.firstName?.trim()) {
      formError.firstName = 'First name is required'
    } else if (!data.lastName?.trim()) {
      formError.lastName = 'Last name is required'
    } else if (!data.email?.trim()) {
      formError.email = 'Email is required'
    } else if (!data.collegeName?.trim()) {
      formError.collegeName = 'College name is required'
    } else if (!data.course?.trim()) {
      formError.course = 'Course is required'
    } else if (!data.password) {
      formError.password = 'Password is required'
    } else if (!data.confirmpass) {
      formError.confirmpass = 'Confirm password is required'
    } else if (data.password !== data.confirmpass) {
      formError.confirmpass = 'Passwords do not match'
    }

    setError(formError)
    return Object.keys(formError).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setApiError('')

    if (!validate(signupData)) return

    setLoading(true)

    try {
      const res = await signup(signupData)
      const { success, message, token } = res.data

      if (success && token) {
        saveAuthToken(token)
        navigate('/student/dashboard', { replace: true })
        return
      }

      setApiError(message || 'Unable to create account. Please try again.')
    } catch (err) {
      setApiError(err.response?.data?.message || 'Unable to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-neutral-primary-soft">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-4 py-10 lg:grid-cols-[420px_1fr]">
        <section className="rounded-base border border-default bg-neutral-primary p-6 shadow-xs sm:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-heading">Create account</h1>
            <p className="mt-2 text-sm text-body">
              Register your student profile to start using the exam dashboard.
            </p>
          </div>

          {apiError ? (
            <div className="mb-5 rounded-base border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {apiError}
            </div>
          ) : null}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                id="firstName"
                label="First name"
                icon={UserRound}
                value={signupData.firstName || ''}
                error={error.firstName}
                onChange={handleChange}
                autoComplete="given-name"
              />
              <TextField
                id="lastName"
                label="Last name"
                icon={UserRound}
                value={signupData.lastName || ''}
                error={error.lastName}
                onChange={handleChange}
                autoComplete="family-name"
              />
            </div>

            <TextField
              id="email"
              label="Email address"
              type="email"
              icon={Mail}
              value={signupData.email || ''}
              error={error.email}
              onChange={handleChange}
              autoComplete="email"
              placeholder="name@example.com"
            />

            <TextField
              id="collegeName"
              label="College name"
              icon={GraduationCap}
              value={signupData.collegeName || ''}
              error={error.collegeName}
              onChange={handleChange}
              autoComplete="organization"
            />

            <TextField
              id="course"
              label="Course"
              icon={GraduationCap}
              value={signupData.course || ''}
              error={error.course}
              onChange={handleChange}
              placeholder="B.Tech Computer Science"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                id="password"
                label="Password"
                type="password"
                icon={LockKeyhole}
                value={signupData.password || ''}
                error={error.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <TextField
                id="confirmpass"
                label="Confirm password"
                type="password"
                icon={LockKeyhole}
                value={signupData.confirmpass || ''}
                error={error.confirmpass}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-base border border-transparent bg-brand px-4 py-2.5 text-sm font-medium leading-5 text-white shadow-xs hover:bg-brand-strong focus:outline-none focus:ring-4 focus:ring-brand-medium disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? <LoaderCircle className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
              {loading ? 'Creating account' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-body">
            Already registered?{' '}
            <Link to="/login" className="font-medium text-fg-brand hover:underline">
              Sign in
            </Link>
          </p>
        </section>

        <section className="hidden lg:block">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-fg-brand">
            Student onboarding
          </p>
          <h2 className="max-w-xl text-4xl font-bold leading-tight text-heading">
            Keep your exam identity and progress in one place.
          </h2>
          <p className="mt-4 max-w-lg text-base leading-7 text-body">
            Your profile powers dashboard context, exam reminders, and course
            details across the examination system.
          </p>
        </section>
      </div>
    </main>
  )
}

function TextField({
  id,
  label,
  type = 'text',
  icon: Icon,
  value,
  error,
  onChange,
  placeholder,
  autoComplete,
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2.5 block text-sm font-medium text-heading">
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-body" />
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-10 py-2.5 text-sm text-heading shadow-xs placeholder:text-body focus:border-brand focus:ring-brand"
          placeholder={placeholder || label}
          autoComplete={autoComplete}
        />
      </div>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  )
}
