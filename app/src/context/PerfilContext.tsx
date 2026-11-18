import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Perfil } from '../types'

interface PerfilContextValue {
  perfil: Perfil
  setPerfil: (p: Perfil) => void
}

const PerfilContext = createContext<PerfilContextValue | null>(null)

export const NOMES_PERFIL: Record<Perfil, string> = {
  atuante: 'Estagiário / Extensionista / Técnico',
  supervisor: 'Supervisor de campo',
  registro: 'Setor de Registro',
  gestao: 'Gestão (Direção)',
}

/** Rota inicial de cada perfil. */
export const HOME_PERFIL: Record<Perfil, string> = {
  atuante: '/fichas',
  supervisor: '/validacao',
  registro: '/registro/painel',
  gestao: '/relatorios',
}

/** Ao abrir um link direto, escolhe o perfil que faz sentido para aquela rota. */
function perfilPelaRota(caminho: string): Perfil {
  if (caminho.startsWith('/validacao')) return 'supervisor'
  if (caminho.startsWith('/registro')) return 'registro'
  if (caminho.startsWith('/relatorios')) return 'gestao'
  return 'atuante'
}

export function PerfilProvider({ children }: { children: ReactNode }) {
  const [perfil, setPerfil] = useState<Perfil>(() => perfilPelaRota(window.location.pathname))
  return <PerfilContext.Provider value={{ perfil, setPerfil }}>{children}</PerfilContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePerfil() {
  const ctx = useContext(PerfilContext)
  if (!ctx) throw new Error('usePerfil precisa estar dentro de <PerfilProvider>')
  return ctx
}
