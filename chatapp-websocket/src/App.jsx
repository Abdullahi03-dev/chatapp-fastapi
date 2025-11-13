import { useState } from 'react'
// import './App.css'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Index from './pages/index'
import Auth from './pages/Auth'
import Chat from './pages/Chat'
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  return (
    <>
     <Router>
      <Routes>
        <Route element={<Index/>} path='/' />
        <Route element={<Auth/>} path='/auth'/>
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
      </Routes>
     </Router>
    </>
  )
}

export default App
