import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './layout/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import Intelligence from './pages/Intelligence'
import Weather from './pages/Weather'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

function App() {
  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/intelligence" element={<Intelligence />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </DashboardLayout>
    </Router>
  )
}

export default App
