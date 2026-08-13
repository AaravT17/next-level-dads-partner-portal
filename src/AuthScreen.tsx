import { useState } from 'react'
import { useAuth } from './auth/AuthContext'

const inputClass =
  'mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 focus:border-[#c9932e] focus:outline-none focus:ring-1 focus:ring-[#c9932e]'
const labelClass = 'block text-sm font-medium text-neutral-700'

// Mirrors the backend's validate_password_strength exactly (app/utils/auth.py)
const passwordRequirements = [
  { label: 'At least 8 characters', test: (pwd: string) => pwd.length >= 8 },
  { label: 'One uppercase letter', test: (pwd: string) => /[A-Z]/.test(pwd) },
  { label: 'One lowercase letter', test: (pwd: string) => /[a-z]/.test(pwd) },
  { label: 'One number', test: (pwd: string) => /[0-9]/.test(pwd) },
  {
    label: 'One special character (e.g. ! @ # $ %)',
    test: (pwd: string) => /[-#!$@£%^&*()_+|~=`{}[\]:";'<>?,./\\]/.test(pwd),
  },
]

function AuthScreen() {
  const { login } = useAuth()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const endpoint = mode === 'signup' ? '/api/auth/register/organizations' : '/api/auth/login'

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.detail || 'Something went wrong.')
        return
      }

      if (mode === 'signup') {
        alert('Account created! Please check your email to verify, then log in.')
        setMode('login')
        return
      }

      login(data.access_token)
    } catch {
      setError('Something went wrong. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] px-4 py-12">
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#c9932e]">Partner Portal</p>
          <h1 className="mt-2 text-3xl font-bold text-neutral-900">
            {mode === 'login' ? 'Log in' : 'Create your account'}
          </h1>
          <p className="mt-2 text-neutral-600">
            {mode === 'login'
              ? 'Already applied or an approved partner? Log in below.'
              : 'New here? Create an account, then fill out your application.'}
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                required
              />
              {mode === 'signup' && (
                <ul className="mt-2 space-y-1 text-xs">
                  {passwordRequirements.map((req) => {
                    const met = req.test(password)
                    return (
                      <li key={req.label} className={met ? 'text-green-600' : 'text-neutral-500'}>
                        {met ? '✓' : '○'} {req.label}
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-neutral-900 px-4 py-2.5 font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Sign up'}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login')
              setError(null)
            }}
            className="mt-4 text-sm text-neutral-600 underline"
          >
            {mode === 'login' ? 'New partner? Sign up instead' : 'Already have an account? Log in'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthScreen
