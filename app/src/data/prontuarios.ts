import type { EventoProntuario, Modalidade, Prontuario, StatusProntuario } from '../types'
import { atuanteLogado, fichasParaValidar, supervisorLogado, usuarios } from './mock'

/*
 * Prontuários fictícios. Os textos são genéricos de propósito: nenhum conteúdo clínico real.
 * Novembro (Beatriz) cobre todos os estados para demonstrar o ciclo; outubro vem das fichas em validação.
 */

const SUP = supervisorLogado.nome
const BEA = atuanteLogado.nome

const TEXTOS = [
  'Sessão de acompanhamento. Usuário relatou a semana e retomou o tema trabalhado na sessão anterior. Combinado manter a frequência semanal.',
  'Sessão de acompanhamento. Trabalhada a organização da rotina de estudos. Usuário trouxe registro das atividades propostas.',
  'Sessão de acompanhamento. Revisados os objetivos do processo e o que mudou desde o início. Sem intercorrências.',
  'Sessão de acompanhamento. Usuário chegou no horário; conversa sobre adaptação a mudanças recentes. Próxima sessão mantida.',
]
const texto = (i: number) => TEXTOS[i % TEXTOS.length]

function p(
  id: string,
  atuanteId: string,
  usuarioId: string,
  modalidade: Modalidade,
  data: string,
  status: StatusProntuario,
  eventos: EventoProntuario[],
  t = texto(Number(data.slice(8))),
): Prontuario {
  return { id, atuanteId, usuarioId, modalidade, data, texto: t, status, eventos }
}

const enviadoValidado = (autor: string, data: string, validadoEm: string): EventoProntuario[] => [
  { em: data, autor, acao: 'enviado' },
  { em: validadoEm, autor: SUP, acao: 'validado' },
]

const novembro: Prontuario[] = [
  p('pr1', 'a1', 'u1', 'Psicoterapia', '2026-11-03', 'validado', enviadoValidado(BEA, '2026-11-03', '2026-11-05')),
  p('pr2', 'a1', 'u1', 'Psicoterapia', '2026-11-10', 'validado', enviadoValidado(BEA, '2026-11-10', '2026-11-12')),
  // escrito, mas ainda não enviado
  p('pr3', 'a1', 'u1', 'Psicoterapia', '2026-11-17', 'rascunho', [{ em: '2026-11-17', autor: BEA, acao: 'criado' }], 'Sessão de acompanhamento. (terminar de escrever)'),
  p('pr4', 'a1', 'u2', 'Psicoterapia', '2026-11-05', 'validado', enviadoValidado(BEA, '2026-11-05', '2026-11-07')),
  // devolvido: o aluno precisa corrigir
  p('pr5', 'a1', 'u2', 'Psicoterapia', '2026-11-12', 'devolvido', [
    { em: '2026-11-12', autor: BEA, acao: 'enviado' },
    { em: '2026-11-14', autor: SUP, acao: 'devolvido', comentario: 'Faltou registrar a intervenção feita e o que ficou combinado para a próxima sessão.' },
  ], 'Sessão de acompanhamento. Usuária falou sobre a semana.'),
  p('pr6', 'a1', 'u3', 'Psicoterapia', '2026-11-13', 'aguardando_supervisor', [{ em: '2026-11-13', autor: BEA, acao: 'enviado' }]),
  // corrigido e reenviado depois de uma devolução
  p('pr7', 'a1', 'u8', 'Psicoterapia', '2026-11-06', 'aguardando_supervisor', [
    { em: '2026-11-06', autor: BEA, acao: 'enviado' },
    { em: '2026-11-09', autor: SUP, acao: 'devolvido', comentario: 'Registre as faltas dos dias 13 e 20 e se houve contato com a usuária.' },
    { em: '2026-11-16', autor: BEA, acao: 'reenviado', comentario: 'Incluí as faltas e a tentativa de contato por telefone.' },
  ]),
  // a2 (Caio): declarou 04/11 e 10/11
  p('pr8', 'a2', 'u5', 'Psicoterapia', '2026-11-04', 'validado', enviadoValidado('Caio Medeiros', '2026-11-04', '2026-11-06')),
  p('pr9', 'a2', 'u5', 'Psicoterapia', '2026-11-10', 'aguardando_supervisor', [{ em: '2026-11-11', autor: 'Caio Medeiros', acao: 'enviado' }]),
]
// Carla M. Rocha (04/11) fica SEM prontuário de propósito: a ficha acusa o erro.

/** Outubro: um prontuário por data das fichas em validação. Quase todos validados; um ainda aguardando. */
const outubro: Prontuario[] = fichasParaValidar.flatMap((f) =>
  f.linhas.flatMap((l) => {
    const usuarioId = usuarios.find((u) => u.nome === l.usuario)?.id ?? l.usuario
    return l.datas.map((dm, i) => {
      const data = `2026-10-${dm.slice(0, 2)}`
      const pendente = f.atuante.id === 'a1' && l.usuario === 'Rafael T. Nunes' && i === l.datas.length - 1
      return p(
        `out-${f.atuante.id}-${usuarioId}-${dm.slice(0, 2)}`,
        f.atuante.id,
        usuarioId,
        l.modalidade,
        data,
        pendente ? 'aguardando_supervisor' : 'validado',
        pendente ? [{ em: data, autor: f.atuante.nome, acao: 'enviado' }] : enviadoValidado(f.atuante.nome, data, data),
      )
    })
  }),
)

export const prontuariosIniciais: Prontuario[] = [...novembro, ...outubro]

/** Nome de quem atendeu (só para a tela do supervisor). */
export const NOMES_ATUANTES: Record<string, string> = Object.fromEntries(fichasParaValidar.map((f) => [f.atuante.id, f.atuante.nome]))
