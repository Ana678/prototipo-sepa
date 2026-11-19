import { useMemo, useState } from 'react'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { IconDownload } from '../../components/ui/icons'
import { PageHeader } from '../../components/ui/PageHeader'
import { SelectMenu } from '../../components/ui/SelectMenu'
import { useToast } from '../../context/ToastContext'
import { painelOutubro } from '../../data/mock'
import { cn } from '../../lib/cn'
import { semEnvio } from '../registro/cruzamentoUsoSala'
import { gerarRelatorio, type Periodo } from './dadosRelatorio'
import { RelatorioGestao } from './RelatorioGestao'
import { RelatorioInteracoes } from './RelatorioInteracoes'
import { RelatorioSupervisoes } from './RelatorioSupervisoes'

const RELATORIOS = [
  { id: 'gestao', rotulo: 'Relatório de Gestão', uso: 'Relatório anual da direção ao CCHLA e prestação de contas à equipe' },
  { id: 'interacoes', rotulo: 'Relatório do Interações', uso: 'Lançado pela gestão no SIGAA' },
  { id: 'supervisoes', rotulo: 'Supervisões', uso: 'Encontros e participações por supervisor' },
] as const
type IdRelatorio = (typeof RELATORIOS)[number]['id']

/** Até onde os dados chegam — ela espera o fim do ano porque hoje não sabe "onde parou" (entrevista 10). */
function cobertura(ano: string, periodo: Periodo) {
  if (ano === '2026' && periodo === 'parcial')
    return { tom: 'ok' as const, texto: '1º semestre de 2026 fechado: todas as fichas de março a julho estão validadas.' }
  if (ano !== '2026') return { tom: 'ok' as const, texto: `Ano fechado: todas as fichas de ${ano} estão validadas.` }
  const validadas = painelOutubro.filter((l) => l.status === 'validada').length
  const aguardando = painelOutubro.filter((l) => l.status === 'aguardando_supervisor' || l.status === 'devolvida').length
  const naoEnviadas = painelOutubro.filter(semEnvio).length
  return {
    tom: 'info' as const,
    texto: `Inclui as fichas validadas até setembro/2026. De outubro: ${validadas} validadas, ${aguardando} em validação ou correção e ${naoEnviadas} não enviadas. Elas entram sozinhas quando forem validadas.`,
  }
}

export function RelatoriosPage() {
  const toast = useToast()
  const [relatorio, setRelatorio] = useState<IdRelatorio>('gestao')
  const [ano, setAno] = useState('2026')
  const [periodo, setPeriodo] = useState<Periodo>('anual')
  const dados = useMemo(() => gerarRelatorio(periodo), [periodo])
  const atual = RELATORIOS.find((r) => r.id === relatorio)!
  const cob = cobertura(ano, periodo)

  return (
    <>
      <PageHeader
        titulo="Relatórios"
        subtitulo="Gerados das fichas validadas e das atividades registradas: sem refazer planilha a cada pedido."
        acoes={
          <>
            <Button variante="secundario" onClick={() => toast('Exportação em planilha (.xlsx): formato a confirmar com o SEPA.')}>
              <IconDownload size={18} /> Planilha
            </Button>
            <Button onClick={() => toast('Exportação em PDF: formato a confirmar com o SEPA.')}>
              <IconDownload size={18} /> PDF
            </Button>
          </>
        }
      />

      {/* Qual relatório + período */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div role="tablist" aria-label="Relatório" className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          {RELATORIOS.map((r) => (
            <button
              key={r.id}
              role="tab"
              aria-selected={r.id === relatorio}
              onClick={() => setRelatorio(r.id)}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                r.id === relatorio ? 'bg-white text-sepa-700 shadow-sm dark:bg-slate-900 dark:text-sepa-200' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white',
              )}
            >
              {r.rotulo}
            </button>
          ))}
        </div>
        <div className="flex items-end gap-3">
          <SelectMenu
            label="Ano"
            className="w-44"
            value={ano}
            onChange={setAno}
            opcoes={[
              { valor: '2026', rotulo: '2026', descricao: 'Em andamento' },
              { valor: '2025', rotulo: '2025', descricao: 'Fechado' },
            ]}
          />
          <SelectMenu
            label="Período"
            className="w-64"
            value={periodo}
            onChange={setPeriodo}
            opcoes={[
              { valor: 'anual', rotulo: 'Ano completo', descricao: 'Relatório de fim de ano' },
              { valor: 'parcial', rotulo: 'Parcial: 1º semestre', descricao: 'Balanço do meio do ano, quando fecha o ciclo do 4º ano' },
            ]}
          />
        </div>
      </div>

      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">{atual.uso}.</p>

      <div className="mb-5">
        <Alert tom={cob.tom}>{cob.texto}</Alert>
      </div>

      {relatorio === 'gestao' && <RelatorioGestao r={dados} />}
      {relatorio === 'interacoes' && <RelatorioInteracoes r={dados} />}
      {relatorio === 'supervisoes' && <RelatorioSupervisoes r={dados} />}

      <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">Números de exemplo, na ordem de grandeza dos Relatórios de Gestão. Nenhum dado real.</p>
    </>
  )
}
