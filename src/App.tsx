import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DataProviderComponent } from './providers'
import { Layout } from './components/Layout'
import { Chat } from './components/Chat'
import { Team } from './pages/Team'
import { MemberDetail } from './pages/MemberDetail'
import { Tasks } from './pages/Tasks'
import { Workflows } from './pages/Workflows'
import { WorkflowDetail } from './pages/WorkflowDetail'
import { Settings } from './pages/Settings'
import { Dashboard } from './pages/Dashboard'
import { Organization } from './pages/Organization'
import { Administration } from './pages/Administration'

function App() {
  return (
    <DataProviderComponent>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat/:id" element={<Chat />} />
            <Route path="/team" element={<Team />} />
            <Route path="/team/:id" element={<MemberDetail />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/processes" element={<Workflows />} />
            <Route path="/processes/:id" element={<WorkflowDetail />} />
            <Route path="/organization" element={<Organization />} />
            <Route path="/admin" element={<Administration />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/chat" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DataProviderComponent>
  )
}

export default App
