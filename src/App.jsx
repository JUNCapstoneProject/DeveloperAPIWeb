import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/common/navbar'
import Home from './pages/Home'
import Apply from './pages/Apply'
import Explain from './pages/Explain'
import MyAPI from './pages/MyAPI'
function App() {

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<Explain />} />
        <Route path='/usage' element={<Apply />} />
        <Route path='/apps' element={<MyAPI />} />
      </Routes>
    </div>
  )
}

export default App
