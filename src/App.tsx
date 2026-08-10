import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import AuthScreen from './AuthScreen'
import ApplicationForm from './ApplicationForm'
import Toolbar from './components/Toolbar'
import Sidebar from './components/Sidebar'
import Overview from './pages/Overview'
import Communities from './pages/Communities'
import Events from './pages/Events'
import Messaging from './pages/Messaging'

type Application = {
  status: 'pending' | 'approved' | 'rejected'
}

function Dashboard({
  restricted = false,
  onLogout,
  accessToken,
}: {
  restricted?: boolean
  onLogout: () => void
  accessToken: string
}) {
  const [showSidebar, setShowSidebar] = useState<boolean>(false)

  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} restricted={restricted} />

        <div className="main-content flex-1">
          <Toolbar showSidebar={showSidebar} setShowSidebar={setShowSidebar} onLogout={onLogout} />

          <Routes>
            {restricted ? (
              <Route index element={<Messaging accessToken={accessToken} />} />
            ) : (
              <>
                <Route index element={<Overview />} />
                <Route path="communities" element={<Communities />} />
                <Route path="events" element={<Events />} />
                <Route path="messaging" element={<Messaging accessToken={accessToken} />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [application, setApplication] = useState<Application | null>(null)
  const [checkingApplication, setCheckingApplication] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  async function handleAuthenticated(token: string) {
    setAccessToken(token)
    setCheckingApplication(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/organizations/applications/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setApplication(res.ok ? await res.json() : null)
    } finally {
      setCheckingApplication(false)
    }
  }

  useEffect(() => {
    async function restoreSession() {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        })
        if (res.ok) {
          const data = await res.json()
          await handleAuthenticated(data.access_token)
        }
      } catch {
        // no valid session to restore — fall through to the login screen
      } finally {
        setCheckingSession(false)
      }
    }
    restoreSession()
    // Runs once on mount only — intentionally not re-run on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleLogout() {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: { Authorization: `Bearer ${accessToken}` },
      })
    } catch {
      // ignore — still clear local state below regardless
    }
    setAccessToken(null)
    setApplication(null)
  }

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf7f2]">
        <p className="text-neutral-600">Loading...</p>
      </div>
    )
  }

  if (!accessToken) {
    return <AuthScreen onAuthenticated={handleAuthenticated} />
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
      return <Dashboard onLogout={handleLogout} accessToken={accessToken} />
    }

    if (application.status === 'pending') {
      return <Dashboard restricted onLogout={handleLogout} accessToken={accessToken} />
    }

    return (
      <div className="min-h-screen bg-[#faf7f2] px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#c9932e]">Application Status</p>
            <h1 className="mt-2 text-3xl font-bold text-neutral-900">Your application was not approved</h1>
            <button onClick={handleLogout} className="mt-4 text-sm text-neutral-600 underline">
              Log out
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ApplicationForm
      accessToken={accessToken}
      onSubmitted={() => setApplication({ status: 'pending' })}
    />
  )
}

export default App