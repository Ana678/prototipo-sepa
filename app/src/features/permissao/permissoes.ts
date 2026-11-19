import { HOJE, painelOutubro, type LinhaPainel } from '../../data/mock'
import type { SituacaoSala } from '../../types'
import { declaracaoDe } from '../registro/cruzamentoUsoSala'
import { janelaVigente, situacaoPessoa, type ExcecaoSupervisor, type Janela, type PendenciaDeclaracao } from './regraPermissao'

export interface PermissaoPessoa {
  atuanteId: string
  nome: string
  /** Ex.: "4º ano · Extensão (Projeto Acolher)" */
  vinculos: string[]
  situacao: SituacaoSala
  excecao?: ExcecaoSupervisor
  /** Atendimentos que passaram de 15 dias sem declarar (motivo do bloqueio automático). */
  vencidas: PendenciaDeclaracao[]
}

const rotuloVinculo = (l: LinhaPainel) => (l.atuante.projeto ? `${l.atuante.vinculo} (${l.atuante.projeto})` : l.atuante.vinculo)

/** Agrupa as fichas do mês de referência por pessoa e aplica a regra. Painel e Recepção usam a mesma função. */
export function permissoesDaJanela(linhas: LinhaPainel[] = painelOutubro, hoje = HOJE): { janela: Janela; pessoas: PermissaoPessoa[] } {
  const porPessoa = new Map<string, LinhaPainel[]>()
  for (const l of linhas) porPessoa.set(l.atuante.id, [...(porPessoa.get(l.atuante.id) ?? []), l])

  const pessoas = [...porPessoa.values()].map((fichas) => {
    const excecao = fichas.find((f) => f.excecao)?.excecao
    const vencidas = declaracaoDe(fichas[0].atuante.id).pendencias.filter((p) => p.vencida)
    return {
      vencidas,
      atuanteId: fichas[0].atuante.id,
      nome: fichas[0].atuante.nome,
      vinculos: fichas.map(rotuloVinculo),
      situacao: situacaoPessoa(fichas.map((f) => f.status), hoje, excecao, vencidas.length > 0),
      excecao,
    }
  })
  return { janela: janelaVigente(hoje), pessoas: pessoas.sort((a, b) => a.nome.localeCompare(b.nome)) }
}

/** Mapa atuanteId → situação, para colunas de tabela. */
export function situacaoPorPessoa(): Map<string, SituacaoSala> {
  return new Map(permissoesDaJanela().pessoas.map((p) => [p.atuanteId, p.situacao]))
}

export const dataCurta = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`
