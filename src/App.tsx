import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Chat } from './components/Chat'
import { Team } from './pages/Team'
import { MemberDetail } from './pages/MemberDetail'
import { Tasks } from './pages/Tasks'
import { Workflows } from './pages/Workflows'
import { WorkflowDetail } from './pages/WorkflowDetail'
import { Settings } from './pages/Settings'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/chat" replace />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/team" element={<Team />} />
          <Route path="/team/:id" element={<MemberDetail />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/processes" element={<Workflows />} />
          <Route path="/processes/:id" element={<WorkflowDetail />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/chat" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
