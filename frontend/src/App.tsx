import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { LandingPage } from "@/pages/LandingPage"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* Placeholder routes for next phases */}
        <Route path="/login" element={<div className="p-8 text-center">Login Page (Coming soon)</div>} />
        <Route path="/signup" element={<div className="p-8 text-center">Signup Page (Coming soon)</div>} />
        <Route path="/dashboard" element={<div className="p-8 text-center">Dashboard (Coming soon)</div>} />
      </Routes>
    </Router>
  )
}

export default App
