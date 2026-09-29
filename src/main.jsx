import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { track } from './content/visits.js'

track('open')
let lastHash = window.location.hash
window.addEventListener('hashchange', () => { const h = window.location.hash; if (h.split('?')[0] !== lastHash.split('?')[0]) track('open'); lastHash = h })

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
