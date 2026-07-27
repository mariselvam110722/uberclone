import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
