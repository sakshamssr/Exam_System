import { useState } from 'react'
import { LoaderCircle, Save, UserRound } from 'lucide-react'
import { updateProfile } from '../../../api/profileApi'
import { decodeJwtPayload, saveAuthToken } from '../../../lib/auth'

function getInitialProfile() {
  const profile = decodeJwtPayload()
  return {
    firstName: profile?.firstName || profile?.name?.firstName || '',
    lastName: profile?.lastName || profile?.name?.lastName || '',
    email: profile?.email || '',
    collegeName: profile?.collegeName || '',
    course: profile?.course || '',
  }
}

export default function StudentProfile() {
  const [profileData, setProfileData] = useState(getInitialProfile)
  const [error, setError] = useState({})
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setProfileData({ ...profileData, [name]: value })
  }

  function validate(data) {
    const formError = {}
    if (!data.firstName.trim()) formError.firstName = 'First name is required'
    else if (!data.lastName.trim()) formError.lastName = 'Last name is required'
    else if (!data.email.trim()) formError.email = 'Email is required'
    else if (!data.collegeName.trim()) formError.collegeName = 'College name is required'
    else if (!data.course.trim()) formError.course = 'Course is required'
    setError(formError)
    return Object.keys(formError).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    if (!validate(profileData)) return
    setSaving(true)
    try {
      const res = await updateProfile(profileData)
      if (res.data.token) saveAuthToken(res.data.token)
      setMessage(res.data.message || 'Profile updated.')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to update profile.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-heading">Edit profile</h1>
        <p className="mt-1 text-sm text-body">Keep your student details current.</p>
      </div>

      {message ? <div className="mb-5 rounded-base border border-default bg-neutral-primary px-4 py-3 text-sm text-heading shadow-xs">{message}</div> : null}

      <form className="rounded-base border border-default bg-neutral-primary p-6 shadow-xs" onSubmit={handleSubmit}>
        <div className="mb-5 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-base bg-neutral-secondary-soft text-heading">
            <UserRound className="size-5" />
          </div>
          <div>
            <h2 className="font-semibold text-heading">{profileData.firstName || 'Student'} {profileData.lastName}</h2>
            <p className="text-sm text-body">{profileData.email}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="firstName" label="First name" value={profileData.firstName} error={error.firstName} onChange={handleChange} />
          <Field id="lastName" label="Last name" value={profileData.lastName} error={error.lastName} onChange={handleChange} />
          <Field id="email" label="Email" type="email" value={profileData.email} error={error.email} onChange={handleChange} />
          <Field id="collegeName" label="College" value={profileData.collegeName} error={error.collegeName} onChange={handleChange} />
          <Field id="course" label="Course" value={profileData.course} error={error.course} onChange={handleChange} />
        </div>

        <button disabled={saving} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-base bg-brand px-4 py-2.5 text-sm font-medium text-white disabled:opacity-70">
          {saving ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
          Save profile
        </button>
      </form>
    </div>
  )
}

function Field({ id, label, type = 'text', value, error, onChange }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2.5 block text-sm font-medium text-heading">{label}</label>
      <input id={id} name={id} type={type} value={value} onChange={onChange} className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs" />
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  )
}
