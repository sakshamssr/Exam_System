import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, LoaderCircle, LockKeyhole, Mail } from 'lucide-react'
import { login } from '../../../api/authApi'
import { saveAuthToken } from '../../../lib/auth'

export default function Login() {
  const navigate = useNavigate()
  const [loginData, setLoginData] = useState({})
  const [error, setError] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setLoginData({ ...loginData, [name]: value })
  }

  function validate(data) {
    const formError = {}

    if (!data.email?.trim()) {
      formError.email = 'Email is required'
    } else if (!data.password) {
      formError.password = 'Password is required'
    }

    setError(formError)
    return Object.keys(formError).length === 0
  }

  function handleSubmit(event) {
    event.preventDefault()
    setApiError('')

    if (!validate(loginData)) return

    setLoading(true)

    login(loginData)
      .then((res) => {
        const { success, message, role, token } = res.data

        if (success && token) {
          saveAuthToken(token)
          navigate(role === 'admin' ? '/admin/dashboard' : '/student/dashboard', { replace: true })
          return
        }

        setApiError(message || 'Unable to login. Please try again.')
      })
      .catch((err) => {
        setApiError(err.response?.data?.message || 'Unable to login. Please try again.')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <main className="min-h-screen bg-neutral-primary-soft">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-4 py-10 lg:grid-cols-[1fr_420px]">
        <section className="hidden lg:block">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-fg-brand">
            Examination System
          </p>
          <h1 className="max-w-xl text-4xl font-bold leading-tight text-heading">
            Sign in and continue your exam preparation.
          </h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-body">
            Access your dashboard, track upcoming assessments, and keep your
            academic profile ready for every exam session.
          </p>
        </section>

        <section className="rounded-base border border-default bg-neutral-primary p-6 shadow-xs sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-heading">Welcome back</h2>
            <p className="mt-2 text-sm text-body">
              Login with your registered email and password.
            </p>
          </div>

          {apiError ? (
            <div className="mb-5 rounded-base border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {apiError}
            </div>
          ) : null}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="mb-2.5 block text-sm font-medium text-heading">
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-body" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={loginData.email || ''}
                  onChange={handleChange}
                  className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-10 py-2.5 text-sm text-heading shadow-xs placeholder:text-body focus:border-brand focus:ring-brand"
                  placeholder="name@example.com"
                  autoComplete="email"
                />
              </div>
              {error.email ? <p className="mt-2 text-sm text-red-600">{error.email}</p> : null}
            </div>

            <div>
              <label htmlFor="password" className="mb-2.5 block text-sm font-medium text-heading">
                Password
              </label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-body" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={loginData.password || ''}
                  onChange={handleChange}
                  className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-10 py-2.5 text-sm text-heading shadow-xs placeholder:text-body focus:border-brand focus:ring-brand"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
              </div>
              {error.password ? <p className="mt-2 text-sm text-red-600">{error.password}</p> : null}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-base border border-transparent bg-brand px-4 py-2.5 text-sm font-medium leading-5 text-white shadow-xs hover:bg-brand-strong focus:outline-none focus:ring-4 focus:ring-brand-medium disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? <LoaderCircle className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
              {loading ? 'Signing in' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-body">
            New student?{' '}
            <Link to="/signup" className="font-medium text-fg-brand hover:underline">
              Create an account
            </Link>
          </p>
        </section>
      </div>
    </main>
  )
}
