import { Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./components/navbar"
import HomePage from "./pages/homepage"
import SignupPage from "./pages/signup"
import LoginPage from "./pages/LoginPage"
import SettingsPage from "./pages/settings"
import ProfilePage from "./pages/profile"
import { useAuthStore } from "./store/useAuthStore"
import { useEffect } from "react"
import { Loader } from "lucide-react"

function App() {
  const { checkAuth, authUser, isCheckingAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  console.log({ authUser })

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex h-screen items-center justify-center ">
        <div className="animate-spin size-10">
          <Loader />
        </div>
      </div>
    )
  return (
    <div>
      <Navbar />
      <Routes>
        <Route
          path="/"
          //route protected by auth
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  )
}

export default App
