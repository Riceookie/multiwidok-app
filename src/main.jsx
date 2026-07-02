import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles.css'

// HashRouter: trasy trzymane po '#', więc bezpośrednie wejście i odświeżanie
// działa na GitHub Pages bez konfiguracji serwera. Wstecz/naprzód działają normalnie.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
)
