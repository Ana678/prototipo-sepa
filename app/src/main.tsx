import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ConfirmProvider } from './context/ConfirmContext'
import { ProntuarioProvider } from './context/ProntuarioContext'
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
            <ConfirmProvider>
              <ProntuarioProvider>
                <App />
              </ProntuarioProvider>
            </ConfirmProvider>
          </ToastProvider>
        </PerfilProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
