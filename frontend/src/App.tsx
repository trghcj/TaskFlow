import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useEffect } from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { LandingPage } from "@/pages/LandingPage"
import { LoginPage } from "@/pages/LoginPage"
import { SignupPage } from "@/pages/SignupPage"
import { DashboardPage } from "@/pages/DashboardPage"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

function App() {
  const { initializeAuth } = useAuthStore()

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
