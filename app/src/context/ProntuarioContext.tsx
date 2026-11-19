import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { HOJE } from '../data/mock'
import { prontuariosIniciais } from '../data/prontuarios'
import type { EventoProntuario, Prontuario } from '../types'

export interface DadosProntuario {
  usuarioId: string
  modalidade: Prontuario['modalidade']
  data: string
  texto: string
}

interface Valor {
  prontuarios: Prontuario[]
  /** Prontuário de uma sessão (pessoa + usuário + data). */
  daSessao: (atuanteId: string, usuarioId: string, data: string) => Prontuario | undefined
  /** Aluno: cria ou atualiza; `enviar` manda ao supervisor (ou reenvia, se estava devolvido). */
  salvar: (atuanteId: string, autor: string, dados: DadosProntuario, opcoes: { id?: string; enviar: boolean; resposta?: string }) => Prontuario
  /** Supervisor. */
  validar: (id: string, autor: string, comentario?: string) => void
  devolver: (id: string, autor: string, comentario: string) => void
}

const Ctx = createContext<Valor | null>(null)

/** Guarda os prontuários da sessão do protótipo: o que o aluno envia aparece na fila do supervisor e vice-versa. */
export function ProntuarioProvider({ children }: { children: ReactNode }) {
  const [prontuarios, setProntuarios] = useState<Prontuario[]>(prontuariosIniciais)

  const daSessao = useCallback(
    (atuanteId: string, usuarioId: string, data: string) =>
      prontuarios.find((p) => p.atuanteId === atuanteId && p.usuarioId === usuarioId && p.data === data),
    [prontuarios],
  )

  const salvar: Valor['salvar'] = useCallback(
    (atuanteId, autor, dados, { id, enviar, resposta }) => {
      const atual = id ? prontuarios.find((p) => p.id === id) : undefined
      const evento: EventoProntuario | null = enviar
        ? { em: HOJE, autor, acao: atual?.status === 'devolvido' ? 'reenviado' : 'enviado', comentario: resposta?.trim() || undefined }
        : atual
          ? null
          : { em: HOJE, autor, acao: 'criado' }
      const novo: Prontuario = {
        id: atual?.id ?? crypto.randomUUID(),
        atuanteId,
        ...dados,
        status: enviar ? 'aguardando_supervisor' : (atual?.status ?? 'rascunho'),
        eventos: [...(atual?.eventos ?? []), ...(evento ? [evento] : [])],
      }
      setProntuarios((lista) => (lista.some((p) => p.id === novo.id) ? lista.map((p) => (p.id === novo.id ? novo : p)) : [...lista, novo]))
      return novo
    },
    [prontuarios],
  )

  const mudar = useCallback((id: string, status: Prontuario['status'], evento: EventoProntuario) => {
    setProntuarios((lista) => lista.map((p) => (p.id === id ? { ...p, status, eventos: [...p.eventos, evento] } : p)))
  }, [])

  const valor = useMemo<Valor>(
    () => ({
      prontuarios,
      daSessao,
      salvar,
      validar: (id, autor, comentario) => mudar(id, 'validado', { em: HOJE, autor, acao: 'validado', comentario: comentario?.trim() || undefined }),
      devolver: (id, autor, comentario) => mudar(id, 'devolvido', { em: HOJE, autor, acao: 'devolvido', comentario }),
    }),
    [prontuarios, daSessao, salvar, mudar],
  )

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProntuarios() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useProntuarios precisa estar dentro de <ProntuarioProvider>')
  return ctx
}
