import { Link } from 'react-router-dom'
import { Alert } from '../../components/ui/Alert'
import { Card } from '../../components/ui/Card'
import { DataTable } from '../../components/ui/DataTable'
import { PageHeader } from '../../components/ui/PageHeader'
import { StatusFichaBadge, SituacaoSalaBadge } from '../../components/ui/StatusBadge'
import { atuanteLogado, minhasFichas } from '../../data/mock'
import { dataBR, nomeReferencia, prazoEnvio } from '../../lib/datas'

export function MinhasFichasPage() {
  const atual = minhasFichas[0]

  return (
    <>
      <PageHeader
        titulo={`Olá, ${atuanteLogado.nome.split(' ')[0]}`}
        subtitulo={`${atuanteLogado.vinculo} · Supervisão: ${atuanteLogado.supervisor}`}
        acoes={
          <Link
            to="/fichas/nova"
            className="rounded-lg bg-sepa-600 px-4 py-2 text-sm font-medium text-white hover:bg-sepa-700"
          >
            Continuar ficha de {nomeReferencia(atual.referencia)}
          </Link>
        }
      />

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <Alert tom="info" titulo={`Ficha de ${nomeReferencia(atual.referencia)} em rascunho`}>
          Prazo de envio: <strong>{dataBR(prazoEnvio(atual.referencia))}</strong>. Você receberá um lembrete 2 dias antes.
        </Alert>
        <div className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Uso de salas</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Janela 15/11 → 15/12</p>
          </div>
          <SituacaoSalaBadge situacao="liberado" />
        </div>
      </div>

      <Card titulo="Histórico de fichas" descricao="Cada ficha passa por: rascunho → aguardando supervisor → validada (ou devolvida para correção).">
        <DataTable
          chaveLinha={(f) => f.referencia}
          linhas={minhasFichas}
          colunas={[
            { chave: 'ref', titulo: 'Mês', render: (f) => <span className="font-medium first-letter:uppercase">{nomeReferencia(f.referencia)}</span> },
            { chave: 'status', titulo: 'Situação', render: (f) => <StatusFichaBadge status={f.status} /> },
            { chave: 'envio', titulo: 'Enviada em', render: (f) => (f.enviadaEm ? dataBR(f.enviadaEm) : '—') },
            { chave: 'sessoes', titulo: 'Sessões', alinhar: 'direita', render: (f) => f.sessoes },
            { chave: 'obs', titulo: 'Observação do supervisor', render: (f) => <span className="text-slate-600 dark:text-slate-300">{f.obs ?? '—'}</span> },
          ]}
        />
      </Card>
    </>
  )
}
