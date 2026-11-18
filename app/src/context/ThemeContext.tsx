import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Tema = 'claro' | 'escuro'

const CHAVE = 'sepa-tema'

const ThemeContext = createContext<{ tema: Tema; alternar: () => void } | null>(null)

/** Preferência salva > preferência do sistema operacional. */
function temaInicial(): Tema {
  const salvo = localStorage.getItem(CHAVE)
  if (salvo === 'claro' || salvo === 'escuro') return salvo
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>(temaInicial)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', tema === 'escuro')
    localStorage.setItem(CHAVE, tema)
  }, [tema])

  return (
    <ThemeContext.Provider value={{ tema, alternar: () => setTema((t) => (t === 'claro' ? 'escuro' : 'claro')) }}>
      {children}
    </ThemeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTema() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTema precisa estar dentro de <ThemeProvider>')
  return ctx
}
