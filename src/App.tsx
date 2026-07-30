import { BrowserRouter, Routes, Route} from 'react-router'
import './App.css'
import Toolbar from './components/Toolbar'
import Sidebar from './components/Sidebar'
import Overview from './pages/Overview'
import Communities from './pages/Communities'
import Events from './pages/Events'
import { useState } from 'react'

function App() {
  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  return (
    <BrowserRouter>
      <div className='flex'>
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar}/>

        <div className='main-content flex-1'>
          <Toolbar showSidebar={showSidebar} setShowSidebar={setShowSidebar}/>

          <Routes>
            <Route index element={<Overview />} />

            <Route path='communities' element={<Communities />} />

            <Route path='events' element={<Events />} />
          </Routes>

        </div>
      </div>
    </BrowserRouter>
  )
}

export default App