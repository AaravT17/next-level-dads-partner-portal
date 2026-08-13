import { useEffect, useState } from 'react'
import AuthScreen from './AuthScreen'
import ApplicationForm from './ApplicationForm'
import Dashboard from './pages/Dashboard'
import { useAuth } from './auth/AuthContext'
import api from './api/axios'

type Application = {
  status: 'pending' | 'approved' | 'rejected'
}

function App() {
  const { accessToken, isAuthenticated, isCheckingAuth, logout } = useAuth()

  const [application, setApplication] = useState<Application | null>(null)
  const [checkingApplication, setCheckingApplication] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) return
    handleAuthenticated()
    // Runs whenever accessToken changes (login, silent refresh) — intentionally not depending on handleAuthenticated itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken])

  async function handleAuthenticated() {
    setCheckingApplication(true)
    try {
      const res = await api.get('/organizations/applications/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      setApplication(res.status === 200 ? res.data : null)
    } catch {
      // A 404 here just means no application yet — axios throws on non-2xx, so this is expected, not an error.
      setApplication(null)
    } finally {
      setCheckingApplication(false)
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf7f2]">
        <p className="text-neutral-600">Loading...</p>
      </div>
    )
  }

  if (!accessToken) {
    return <AuthScreen />
  }

  if (checkingApplication) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf7f2]">
        <p className="text-neutral-600">Checking your application...</p>
      </div>
    )
  }

  if (application) {
    if (application.status === 'approved') {
      return <Dashboard />
    }

    if (application.status === 'pending') {
      return <Dashboard restricted />
    }

    return (
      <div className="min-h-screen bg-[#faf7f2] px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#c9932e]">Application Status</p>
            <h1 className="mt-2 text-3xl font-bold text-neutral-900">Your application was not approved</h1>
            <button onClick={logout} className="mt-4 text-sm text-neutral-600 underline">
              Log out
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <ApplicationForm onSubmitted={() => setApplication({ status: 'pending' })} />
}

export default App
