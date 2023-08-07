import { useState } from 'react'
import './index.css'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'

function App() {

  return (
    <>
      <div className='m-0 w-screen h-screen bg-gradient-to-r from-neutral-700 to-neutral-900'>
        <Header />
        <div className='flex w-full'>
          <Sidebar />
          <Dashboard />
        </div>
      </div>
    </>
  )
}

export default App
