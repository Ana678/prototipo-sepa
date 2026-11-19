import { BarChart } from '../../components/charts/BarChart'
import { DataTable } from '../../components/ui/DataTable'
import { StatTile } from '../../components/ui/StatTile'
import { VINCULOS_UFRN, type Relatorio } from './dadosRelatorio'
import { VINCULOS_TERAPEUTA } from './mapeamentos'
import { Secao, Subtitulo } from './Secao'

const fmt = new Intl.NumberFormat('pt-BR')
const pct = (v: number, t: number) => `${((v / (t || 1)) * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`
const zeroClaro = (v: number) => <span className={v === 0 ? 'text-slate-300 dark:text-slate-600' : 'text-slate-700 dark:text-slate-200'}>{fmt.format(v)}</span>
const total = (v: number) => <span className="font-semibold text-slate-900 dark:text-slate-50">{fmt.format(v)}</span>

/** Mesma ordem dos quadros do Relatório de Gestão, para a direção copiar sem reorganizar. */
export function RelatorioGestao({ r }: { r: Relatorio }) {
  const { usuarios, atendimentos } = r
  return (
    <div className="space-y-5">
      <Secao numero={1} titulo="Equipe que atua no SEPA" referencia="Quadro 1" fonte="cadastro">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {r.equipe.map((e) => (
            <div key={e.vinculo} className="rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
              <p className="text-xs text-slate-500 dark:text-slate-400">{e.vinculo}</p>
              <p className="text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">{e.total}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Só totais por vínculo. A lista nominal fica com o documento da direção.</p>
      </Secao>

      <Secao numero={2} titulo="Ações de extensão e público alcançado" referencia="Quadros 2 e 3" fonte="sigaa">
        <DataTable
          porPagina={false}
          chaveLinha={(a) => a.titulo}
          linhas={r.extensao}
          colunas={[
            { chave: 't', titulo: 'Ação', render: (a) => <span className="font-medium text-slate-800 dark:text-slate-100">{a.titulo}</span> },
            { chave: 'c', titulo: 'Categoria', render: (a) => a.categoria },
            { chave: 'p', titulo: 'SEPA como', render: (a) => a.papel },
            { chave: 'n', titulo: 'Público alcançado', alinhar: 'direita', render: (a) => fmt.format(a.publico) },
          ]}
        />
      </Secao>

      <Secao numero={3} titulo="Usuários atendidos" referencia="Quadros 5 a 11" fonte="ficha">
        <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatTile rotulo="Usuários atendidos" valor={fmt.format(usuarios.unicos)} detalhe="Sem duplicidade entre modalidades" />
          {usuarios.porQtdModalidades.map((q) => (
            <StatTile key={q.rotulo} rotulo={q.rotulo} valor={fmt.format(q.valor)} detalhe={`${pct(q.valor, usuarios.unicos)} dos usuários`} />
          ))}
        </div>

        <div className="mb-5 grid gap-6 lg:grid-cols-2">
          <div>
            <Subtitulo>Usuários por modalidade</Subtitulo>
            <BarChart dados={usuarios.porModalidade} unidade="usuários" />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">A soma passa do total porque uma pessoa pode estar em mais de uma modalidade.</p>
          </div>
          <div>
            <div className="flex items-center justify-between gap-2">
              <Subtitulo>Alunos atendidos por centro</Subtitulo>
            </div>
            <BarChart dados={usuarios.alunosPorCentro} unidade="alunos" />
            <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">Curso e centro do aluno não estão na ficha: fonte a definir (SIGAA pelo CPF?).</p>
          </div>
        </div>

        <Subtitulo>Usuários por modalidade e vínculo com a UFRN</Subtitulo>
        <DataTable
          porPagina={false}
          chaveLinha={(l) => l.modalidade}
          celular="tabela"
          linhas={usuarios.modVinculo}
          colunas={[
            { chave: 'm', titulo: 'Modalidade', render: (l) => <span className="font-medium text-slate-800 dark:text-slate-100">{l.modalidade}</span> },
            ...VINCULOS_UFRN.map((v) => ({ chave: v, titulo: v, alinhar: 'direita' as const, render: (l: (typeof usuarios.modVinculo)[number]) => zeroClaro(l.valores[v]) })),
            { chave: 'tot', titulo: 'Total', alinhar: 'direita', render: (l) => total(l.total) },
          ]}
        />
      </Secao>

      <Secao numero={4} titulo="Atendimentos realizados" referencia="Quadro 12 · Tabela 8 (2024)" fonte="ficha">
        <div className="mb-5 grid gap-6 lg:grid-cols-[16rem_1fr]">
          <StatTile rotulo="Atendimentos" valor={fmt.format(atendimentos.total)} detalhe="Todas as modalidades" />
          <div>
            <Subtitulo>Por modalidade</Subtitulo>
            <BarChart dados={atendimentos.porModalidade} unidade="atendimentos" mostrarPercentual />
          </div>
        </div>
        <Subtitulo>Por modalidade e vínculo de quem atendeu</Subtitulo>
        <DataTable
          porPagina={false}
          chaveLinha={(l) => l.modalidade}
          celular="tabela"
          linhas={atendimentos.porTerapeuta}
          colunas={[
            { chave: 'm', titulo: 'Modalidade', render: (l) => <span className="font-medium text-slate-800 dark:text-slate-100">{l.modalidade}</span> },
            ...VINCULOS_TERAPEUTA.map((v) => ({ chave: v, titulo: v, alinhar: 'direita' as const, render: (l: (typeof atendimentos.porTerapeuta)[number]) => zeroClaro(l.valores[v]) })),
            { chave: 'tot', titulo: 'Total', alinhar: 'direita', render: (l) => total(l.total) },
          ]}
        />
      </Secao>

      <Secao numero={5} titulo="Atividades coletivas no espaço do SEPA" referencia="Quadro 13" fonte="atividades">
        <DataTable
          porPagina={false}
          chaveLinha={(a) => a.categoria}
          linhas={[...r.atividadesSEPA, { categoria: 'Total', ...r.totalAtividadesSEPA, projetoProprio: false }]}
          colunas={[
            {
              chave: 'c',
              titulo: 'Categoria',
              render: (a) => <span className={a.categoria === 'Total' ? 'font-semibold text-slate-900 dark:text-slate-50' : 'font-medium text-slate-800 dark:text-slate-100'}>{a.categoria}</span>,
            },
            { chave: 'a', titulo: 'Atividades', alinhar: 'direita', render: (a) => (a.categoria === 'Total' ? total(a.atividades) : fmt.format(a.atividades)) },
            { chave: 'p', titulo: 'Participações', alinhar: 'direita', render: (a) => (a.categoria === 'Total' ? total(a.participacoes) : fmt.format(a.participacoes)) },
          ]}
        />
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Supervisões vêm das supervisões registradas (detalhe na aba Supervisões).</p>
      </Secao>

      <Secao numero={6} titulo="Lista de espera" referencia="Seção de desafios" fonte="aDefinir">
        <BarChart dados={r.listaEspera} unidade="pessoas" />
        <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">O relatório cita a lista de espera, mas nenhuma fonte diz onde ela é controlada. Perguntar ao SEPA.</p>
      </Secao>

      <p className="px-1 text-xs text-slate-500 dark:text-slate-400">
        Fora deste módulo: ações do setor de POT, gestão de pessoas e patrimônio (texto da direção).
      </p>
    </div>
  )
}
