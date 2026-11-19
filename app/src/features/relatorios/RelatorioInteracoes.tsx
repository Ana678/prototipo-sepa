import { Alert } from '../../components/ui/Alert'
import { DataTable } from '../../components/ui/DataTable'
import { StatTile } from '../../components/ui/StatTile'
import type { Relatorio } from './dadosRelatorio'
import { Secao } from './Secao'

const fmt = new Intl.NumberFormat('pt-BR')
const negrito = (v: number) => <span className="font-semibold text-slate-900 dark:text-slate-50">{fmt.format(v)}</span>

/** Relatório do Projeto Interações (lançado no SIGAA): exclui projetos próprios e inclui as ações fora do SEPA. */
export function RelatorioInteracoes({ r }: { r: Relatorio }) {
  const { noSEPA, foraSEPA, totalFora } = r.interacoes
  const totalNoSEPA = { atividades: noSEPA.reduce((s, a) => s + a.atividades, 0), participacoes: noSEPA.reduce((s, a) => s + a.participacoes, 0) }
  const excluidas = r.atividadesSEPA.filter((a) => a.projetoProprio)

  return (
    <div className="space-y-5">
      <Alert tom="info">
        Mesmo dado do Relatório de Gestão, com outra regra: saem as atividades de projetos próprios ({excluidas.map((e) => e.categoria.replace('Ações Formativas — ', '')).join(', ')}) e entram as ações
        feitas fora do SEPA.
      </Alert>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile rotulo="Atividades no SEPA" valor={fmt.format(totalNoSEPA.atividades)} detalhe={`${fmt.format(totalNoSEPA.participacoes)} participações`} />
        <StatTile rotulo="Atividades fora do SEPA" valor={fmt.format(totalFora.atividades)} detalhe={`${fmt.format(totalFora.participacoes)} pessoas alcançadas`} />
        <StatTile rotulo="Usuários atendidos" valor={fmt.format(r.usuarios.unicos)} detalhe="Regra de inclusão a confirmar" />
        <StatTile rotulo="Atendimentos" valor={fmt.format(r.atendimentos.total)} detalhe="Regra de inclusão a confirmar" />
      </div>

      <Secao numero={1} titulo="Atividades no espaço do SEPA" referencia="sem projetos próprios" fonte="atividades">
        <DataTable
          porPagina={false}
          chaveLinha={(a) => a.categoria}
          linhas={[...noSEPA, { categoria: 'Total', ...totalNoSEPA, projetoProprio: false }]}
          colunas={[
            { chave: 'c', titulo: 'Categoria', render: (a) => <span className={a.categoria === 'Total' ? 'font-semibold' : 'font-medium text-slate-800 dark:text-slate-100'}>{a.categoria}</span> },
            { chave: 'a', titulo: 'Atividades', alinhar: 'direita', render: (a) => (a.categoria === 'Total' ? negrito(a.atividades) : fmt.format(a.atividades)) },
            { chave: 'p', titulo: 'Participações', alinhar: 'direita', render: (a) => (a.categoria === 'Total' ? negrito(a.participacoes) : fmt.format(a.participacoes)) },
          ]}
        />
      </Secao>

      <Secao numero={2} titulo="Atividades fora do SEPA" referencia="registradas como “Projeto Interações (fora do SEPA)”" fonte="atividades">
        <DataTable
          porPagina={false}
          chaveLinha={(a) => a.atividade}
          linhas={[...foraSEPA, { atividade: 'Total', ...totalFora }]}
          colunas={[
            { chave: 'c', titulo: 'Atividade', render: (a) => <span className={a.atividade === 'Total' ? 'font-semibold' : 'font-medium text-slate-800 dark:text-slate-100'}>{a.atividade}</span> },
            { chave: 'a', titulo: 'Atividades', alinhar: 'direita', render: (a) => (a.atividade === 'Total' ? negrito(a.atividades) : fmt.format(a.atividades)) },
            { chave: 'p', titulo: 'Público alcançado', alinhar: 'direita', render: (a) => (a.atividade === 'Total' ? negrito(a.participacoes) : fmt.format(a.participacoes)) },
          ]}
        />
      </Secao>

      <p className="px-1 text-xs text-amber-700 dark:text-amber-300">
        A planilha tem uma aba própria “Usuários – Relatório Interações”, com menos usuários que a do Relatório de Gestão. Falta confirmar com o SEPA quais
        atendimentos entram (só os de extensionistas do Interações?).
      </p>
    </div>
  )
}
