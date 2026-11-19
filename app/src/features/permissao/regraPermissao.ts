/**
 * Regra de liberação de salas e chaves — ÚNICO lugar onde ela é calculada.
 *
 * O que as fontes do SEPA dizem (entrevistas 5 e 7 + planilha "Acompanhamento permissão para reserva de salas"):
 *  - a permissão vale numa janela do dia 15 de um mês ao dia 15 do mês seguinte;
 *  - quem libera é a ficha do mês anterior validada pelo supervisor ("zero pendências": ficha + SigSaúde ok);
 *  - o supervisor pode pedir para NÃO bloquear mesmo com pendência (exceção com observação);
 *  - o bloqueio é por PESSOA: pendência em qualquer vínculo bloqueia em tudo.
 *
 * Regra do grupo (Relatório de Alinhamento de Escopo, confirmada pela equipe):
 *  - SÓ bloqueia quem retirou chave e não declarou atendimento naquele dia em até 15 dias (AUTOMÁTICO).
 *    Sem retirada de chave (sem atendimento) não há bloqueio, mesmo com a ficha não enviada.
 *    O dia do atendimento é inferido pela retirada de chave (módulo de Reserva de Salas);
 *    declarar no rascunho já conta. A contagem começa no dia do atendimento.
 */
import type { SituacaoSala, StatusFicha } from '../../types'

/** Prazo para declarar um atendimento na ficha antes do bloqueio automático. */
export const PRAZO_DECLARAR_DIAS = 15

/** Dia em que a janela vira. */
export const DIA_VIRADA_JANELA = 15

export interface Janela {
  /** ISO yyyy-mm-dd */
  inicio: string
  fim: string
  /** Mês da ficha que libera esta janela (yyyy-mm). */
  referenciaFicha: string
}

const iso = (d: Date) => d.toISOString().slice(0, 10)
const utc = (a: number, m: number, d: number) => new Date(Date.UTC(a, m, d))

/** Janela vigente na data informada. Ex.: 18/11 → 15/11 a 15/12, liberada pela ficha de outubro. */
export function janelaVigente(hojeISO: string): Janela {
  const [a, m, d] = hojeISO.split('-').map(Number)
  const mesInicio = d >= DIA_VIRADA_JANELA ? m - 1 : m - 2 // índice 0-based
  const inicio = utc(a, mesInicio, DIA_VIRADA_JANELA)
  const fim = utc(a, mesInicio + 1, DIA_VIRADA_JANELA)
  const ref = utc(a, mesInicio - 1, 1)
  return { inicio: iso(inicio), fim: iso(fim), referenciaFicha: iso(ref).slice(0, 7) }
}

const somarDias = (isoData: string, dias: number) => {
  const d = new Date(`${isoData}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + dias)
  return iso(d)
}
const diasEntre = (de: string, ate: string) => Math.round((Date.parse(ate) - Date.parse(de)) / 86_400_000)

export interface PendenciaDeclaracao {
  /** Dia em que houve uso de sala sem atendimento declarado (ISO). */
  data: string
  /** Último dia para declarar (ISO). */
  limite: string
  vencida: boolean
  /** Dias até o bloqueio (0 = bloqueia amanhã). Negativo quando já venceu. */
  diasRestantes: number
}

/** Dias com retirada de chave e sem atendimento declarado, com o prazo de 15 dias de cada um. */
export function pendenciasDeclaracao(diasComChave: string[], declaradas: Set<string>, hojeISO: string): PendenciaDeclaracao[] {
  return [...new Set(diasComChave)]
    .filter((d) => !declaradas.has(d) && d <= hojeISO)
    .sort()
    .map((data) => {
      const limite = somarDias(data, PRAZO_DECLARAR_DIAS)
      return { data, limite, vencida: hojeISO > limite, diasRestantes: diasEntre(hojeISO, limite) }
    })
}

export type StatusFichaPermissao = StatusFicha | 'nao_enviada'

export interface ExcecaoSupervisor {
  /** Até quando vale (ISO). Vencida, volta a bloquear. */
  ate: string
  motivo: string
}

/**
 * Situação de UMA ficha (um vínculo).
 * Ficha não enviada ou em rascunho NÃO bloqueia por si só: quem não atendeu não tem o que declarar.
 * O bloqueio por falta de registro vem só da regra dos 15 dias (chave retirada sem atendimento declarado).
 */
function situacaoDaFicha(status: StatusFichaPermissao): SituacaoSala {
  if (status === 'aguardando_supervisor') return 'aguardando'
  if (status === 'devolvida') return 'bloqueado'
  return 'liberado'
}

const GRAVIDADE: Record<SituacaoSala, number> = { liberado: 0, excecao: 1, aguardando: 2, bloqueado: 3 }

/**
 * Situação da PESSOA: considera todas as fichas dela (uma por vínculo) e vale a pior.
 * Uma exceção do supervisor ainda válida transforma pendência em "liberado por exceção".
 */
export function situacaoPessoa(
  fichas: StatusFichaPermissao[],
  hojeISO: string,
  excecao?: ExcecaoSupervisor,
  /** Algum atendimento passou de 15 dias sem ser declarado. */
  declaracaoVencida = false,
): SituacaoSala {
  const pior = [...fichas.map(situacaoDaFicha), ...(declaracaoVencida ? (['bloqueado'] as const) : [])].reduce((a, b) => (GRAVIDADE[b] > GRAVIDADE[a] ? b : a), 'liberado' as SituacaoSala)
  if (pior !== 'liberado' && excecao && excecao.ate >= hojeISO) return 'excecao'
  return pior
}

/** O que a recepção faz em cada caso — sem expor motivo clínico nem dados de usuários. */
export const ORIENTACAO_RECEPCAO: Record<SituacaoSala, { titulo: string; texto: string; entrega: boolean }> = {
  liberado: { titulo: 'Pode entregar a chave', texto: 'Liberado para esta janela.', entrega: true },
  excecao: { titulo: 'Pode entregar a chave', texto: 'Liberado por exceção autorizada pelo supervisor.', entrega: true },
  aguardando: {
    titulo: 'Ainda não liberado',
    texto: 'A ficha do mês está aguardando validação do supervisor. Oriente o aluno a procurar o supervisor de campo.',
    entrega: false,
  },
  bloqueado: {
    titulo: 'Não entregar a chave',
    texto: 'Há pendência de ficha. Oriente o aluno a procurar o Setor de Registro.',
    entrega: false,
  },
}
