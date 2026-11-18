import { useState } from 'react'
import { BarChart } from '../../components/charts/BarChart'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Label } from '../../components/ui/Field'
import { SelectMenu, opcoesDe } from '../../components/ui/SelectMenu'
import { PageHeader } from '../../components/ui/PageHeader'
import { StatTile } from '../../components/ui/StatTile'
import { useToast } from '../../context/ToastContext'
import { relatorio } from '../../data/mock'
import { cn } from '../../lib/cn'
import type { VinculoUFRN } from '../../types'
import { IconDownload } from '../../components/ui/icons'

const VINCULOS: VinculoUFRN[] = ['Externo', 'Aluno', 'Servidor', 'Terceirizado', 'Não identificado']
const MODELOS = ['Relatório de Gestão', 'Relatório do Interações', 'Personalizado'] as const

export function RelatoriosPage() {
  const toast = useToast()
  const [modelo, setModelo] = useState<(typeof MODELOS)[number]>('Relatório de Gestão')
  const [ano, setAno] = useState('2025')
  const [periodo, setPeriodo] = useState('Ano completo')
  const [modalidade, setModalidade] = useState('Todas')
  const [vinculo, setVinculo] = useState('Todos')
  const fmt = new Intl.NumberFormat('pt-BR')

  return (
    <>
      <PageHeader
        titulo="Relatórios"
        subtitulo="Gerados a partir das fichas validadas — sem refazer planilhas a cada pedido."
        acoes={
          <>
            <Button variante="secundario" onClick={() => toast('Exportação em planilha (.xlsx) — formato a confirmar com o SEPA.')}>
              <IconDownload size={18} /> Exportar planilha
            </Button>
            <Button onClick={() => toast('Exportação em PDF — formato a confirmar com o SEPA.')}>
              <IconDownload size={18} /> Exportar PDF
            </Button>
          </>
        }
      />

      {/* Filtros: uma linha acima dos gráficos */}
      <div className="mb-6 flex flex-wrap items-end gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-4 shadow-sm">
        <div>
          <Label>Modelo</Label>
          <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
            {MODELOS.map((m) => (
              <button
                key={m}
                onClick={() => setModelo(m)}
                className={cn('rounded-md px-3 py-1.5 text-sm font-medium', m === modelo ? 'bg-white dark:bg-slate-900 text-sepa-700 dark:text-sepa-200 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white')}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <SelectMenu label="Ano" className="w-28" value={ano} onChange={setAno} opcoes={opcoesDe(['2026', '2025', '2024'])} />
        <SelectMenu label="Período" className="w-44" value={periodo} onChange={setPeriodo} opcoes={opcoesDe(['Ano completo', '1º semestre', '2º semestre'])} />
        <SelectMenu
          label="Modalidade"
          className="w-48"
          value={modalidade}
          onChange={setModalidade}
          opcoes={opcoesDe(['Todas', 'Acolhimento', 'Psicoterapia', 'Neuropsicologia', 'Psicopedagogia', 'Grupo'])}
        />
        <SelectMenu label="Vínculo UFRN" className="w-48" value={vinculo} onChange={setVinculo} opcoes={opcoesDe(['Todos', ...VINCULOS])} />
      </div>

      {modelo === 'Relatório do Interações' && (
        <div className="mb-5">
          <Alert tom="info">Este modelo exclui automaticamente as atividades de projetos próprios e inclui as ações do Interações fora do SEPA.</Alert>
        </div>
      )}

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile rotulo="Usuários atendidos" valor={fmt.format(relatorio.usuariosUnicos)} detalhe="Sem duplicidade entre modalidades" />
        <StatTile rotulo="Atendimentos" valor={fmt.format(relatorio.atendimentos)} detalhe="Todas as modalidades" />
        <StatTile rotulo="Atividades coletivas" valor={fmt.format(relatorio.atividadesColetivas)} detalhe="No espaço físico do SEPA" />
        <StatTile rotulo="Participações" valor={fmt.format(relatorio.participacoes)} detalhe="Em atividades coletivas" />
      </div>

      <div className="mb-5 grid gap-5 lg:grid-cols-2">
        <Card titulo="Atendimentos por modalidade" descricao={`${relatorio.ano} · quantidade de sessões`}>
          <BarChart dados={relatorio.atendimentosPorModalidade} unidade="atendimentos" mostrarPercentual />
        </Card>
        <Card titulo="Usuários por número de modalidades" descricao="Quantos passaram por mais de um serviço">
          <BarChart dados={relatorio.porQtdModalidades} unidade="usuários" mostrarPercentual />
        </Card>
      </div>

      <Card titulo="Usuários por modalidade e vínculo com a UFRN" descricao="Quadros 7 a 11 do Relatório de Gestão" className="mb-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs tracking-wide text-slate-500 dark:text-slate-400 uppercase">
                <th className="px-3 py-2 text-left font-medium">Modalidade</th>
                {VINCULOS.map((v) => <th key={v} className="px-3 py-2 text-right font-medium">{v}</th>)}
                <th className="px-3 py-2 text-right font-semibold text-slate-700 dark:text-slate-200">Total</th>
              </tr>
            </thead>
            <tbody>
              {relatorio.usuariosPorModalidadeVinculo.map((l) => {
                const total = VINCULOS.reduce((s, v) => s + l.valores[v], 0)
                return (
                  <tr key={l.modalidade} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/60">
                    <td className="px-3 py-2.5 font-medium text-slate-800 dark:text-slate-100">{l.modalidade}</td>
                    {VINCULOS.map((v) => (
                      <td key={v} className={cn('px-3 py-2.5 text-right tabular-nums', l.valores[v] === 0 ? 'text-slate-300 dark:text-slate-600' : 'text-slate-700 dark:text-slate-200')}>{l.valores[v]}</td>
                    ))}
                    <td className="px-3 py-2.5 text-right font-semibold tabular-nums">{total}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">A soma das modalidades é maior que o total de usuários porque uma pessoa pode estar em mais de uma.</p>
      </Card>

      <Card titulo="Alunos atendidos por centro acadêmico" descricao="Pedido da equipe do Registro — filtrável por curso">
        <BarChart dados={relatorio.alunosPorCentro} unidade="alunos" />
      </Card>
    </>
  )
}
