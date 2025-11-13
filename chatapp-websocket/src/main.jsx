import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import {Sooner} from 'sooner'
import {Toaster} from 'react-hot-toast'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster/>
    {/* <Sooner/> */}
  </StrictMode>,
)
