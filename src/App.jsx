import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* We will add page components here, for now just a placeholder for Home */}
          <Route index element={
            <div style={{ paddingTop: '100px', textAlign: 'center' }}>
              <h1>Welcome to Uber Clone</h1>
              <p>React Migration in Progress</p>
            </div>
          } />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
