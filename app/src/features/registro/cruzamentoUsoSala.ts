import { declaradasNovembro, HOJE, painelOutubro, usosDeSala, type LinhaPainel } from '../../data/mock'
import { pendenciasDeclaracao, type PendenciaDeclaracao } from '../permissao/regraPermissao'

/** Ficha que passou do prazo sem ser enviada: não iniciada ou parada em rascunho. */
export const semEnvio = (l: LinhaPainel) => l.status === 'nao_enviada' || l.status === 'rascunho' || l.status === 'atrasada'

export interface Declaracao {
  /** Dias (ISO) em que a pessoa retirou chave. */
  diasComChave: string[]
  /** Dias (ISO) com atendimento declarado na ficha — enviada ou em rascunho. */
  declaradas: Set<string>
  /** Dias com chave e sem atendimento declarado, cada um com seu prazo de 15 dias. */
  pendencias: PendenciaDeclaracao[]
}

const ddmmParaISO = (ddmm: string, ano = 2026) => `${ano}-${ddmm.slice(3, 5)}-${ddmm.slice(0, 2)}`

/**
 * Cruza retiradas de chave (módulo de Reserva de Salas) com o que foi declarado nas fichas, POR PESSOA
 * (somando todos os vínculos e meses).
 */
function calcular(hoje = HOJE): Map<string, Declaracao> {
  const declaradas = new Map<string, Set<string>>()
  const marcar = (id: string, datas: string[]) => {
    const set = declaradas.get(id) ?? new Set<string>()
    datas.forEach((d) => set.add(d))
    declaradas.set(id, set)
  }
  for (const l of painelOutubro) marcar(l.atuante.id, (l.datasFicha ?? []).map((d) => ddmmParaISO(d)))
  for (const [id, datas] of Object.entries(declaradasNovembro)) marcar(id, datas)

  const resultado = new Map<string, Declaracao>()
  for (const [id, set] of declaradas) {
    const diasComChave = [...new Set(usosDeSala.filter((u) => u.atuanteId === id).map((u) => u.data))].sort()
    resultado.set(id, { diasComChave, declaradas: set, pendencias: pendenciasDeclaracao(diasComChave, set, hoje) })
  }
  return resultado
}

const cache = calcular()

export function declaracaoDe(atuanteId: string): Declaracao {
  return cache.get(atuanteId) ?? { diasComChave: [], declaradas: new Set(), pendencias: [] }
}
