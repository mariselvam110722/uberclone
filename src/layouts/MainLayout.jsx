import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      {/* We can add a Footer component here later */}
    </>
  )
}

export default MainLayout
