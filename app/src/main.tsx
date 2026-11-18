import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { PerfilProvider } from './context/PerfilContext'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import 'material-symbols/rounded.css'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <PerfilProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </PerfilProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
