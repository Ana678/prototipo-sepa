import type { Prontuario, StatusProntuario } from '../../types'

/** O que pede ação vem primeiro; dentro do grupo, a sessão mais recente primeiro. */
const ORDEM: Record<StatusProntuario, number> = { devolvido: 0, rascunho: 1, aguardando_supervisor: 2, validado: 3 }

export function ordenar(lista: Prontuario[], ordem: Record<StatusProntuario, number> = ORDEM) {
  return [...lista].sort((a, b) => ordem[a.status] - ordem[b.status] || b.data.localeCompare(a.data))
}

/** Último comentário do supervisor (devolução ou validação). */
export function ultimoComentario(p: Prontuario) {
  return [...p.eventos].reverse().find((e) => e.comentario && (e.acao === 'devolvido' || e.acao === 'validado'))
}

export type FiltroProntuario = 'todos' | StatusProntuario
