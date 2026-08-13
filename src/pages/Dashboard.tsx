import { useState } from "react"
import { BrowserRouter, Route, Routes } from "react-router"
import Sidebar from "../components/Sidebar"
import Toolbar from "../components/Toolbar"
import Messaging from "./Messaging"
import Overview from "./Overview"
import Communities from "./Communities"
import Events from "./events/Events"
import EventApplication from "./events/EventApplication"
import SubmissionStatus from "./SubmissionStatus"


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
              // Display if application has not been approved
              <Route index element={<Messaging />} />
            ) : (
              <>
                {/* Overview Routes */}
                <Route index element={<Overview />} />

                {/* Communities Routes */}
                <Route path="communities" element={<Communities />} />

                {/* Event Routes */}
                <Route path="events" element={<Events />} />
                <Route path="event-application" element={<EventApplication />}/>

                {/* Messaging Routes */}
                <Route path="messaging" element={<Messaging />} />

                {/* Submission Status Routes */}
                <Route path="submissions" element={<SubmissionStatus />} />

              </>
            )}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default Dashboard