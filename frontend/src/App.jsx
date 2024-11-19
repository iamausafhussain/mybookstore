import { Outlet } from 'react-router-dom'
import './App.css'
import { Navbar } from './components/layout'
import Footer from './components/Footer'

function App() {

  return (

    <div className="bg-gray-50 font-primary color text-slate-950  ">
      <Navbar />
      <main className=' min-h-screen max-w-screen-2xl mx-auto px-4 py-6'>
        <Outlet />
      </main>
      {/* <Footer />   */}
    </div>

  )
}

export default App
