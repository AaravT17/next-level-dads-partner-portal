import { useState } from 'react'
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

function Dashboard({ restricted = false }: { restricted?: boolean }) {
  const [showSidebar, setShowSidebar] = useState<boolean>(false)

  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} restricted={restricted} />

        <div className="main-content flex-1">
          <Toolbar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

          <Routes>
            {restricted ? (
              <Route index element={<Messaging />} />
            ) : (
              <>
                <Route index element={<Overview />} />
                <Route path="communities" element={<Communities />} />
                <Route path="events" element={<Events />} />
                <Route path="messaging" element={<Messaging />} />
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