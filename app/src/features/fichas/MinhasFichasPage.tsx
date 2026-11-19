import { Link } from 'react-router-dom'
import { Alert } from '../../components/ui/Alert'
import { Card } from '../../components/ui/Card'
import { DataTable } from '../../components/ui/DataTable'
import { PageHeader } from '../../components/ui/PageHeader'
import { StatusFichaBadge, SituacaoSalaBadge } from '../../components/ui/StatusBadge'
import { useProntuarios } from '../../context/ProntuarioContext'
import { atuanteLogado, minhasFichas } from '../../data/mock'
import { dataBR, nomeReferencia, prazoEnvio } from '../../lib/datas'
import { dataCurta, permissoesDaJanela } from '../permissao/permissoes'
import { PRAZO_DECLARAR_DIAS } from '../permissao/regraPermissao'
import { declaracaoDe } from '../registro/cruzamentoUsoSala'

const { janela, pessoas } = permissoesDaJanela()
const minhaSala = pessoas.find((p) => p.atuanteId === atuanteLogado.id)?.situacao ?? 'bloqueado'
const minhasPendencias = declaracaoDe(atuanteLogado.id).pendencias
const vencidas = minhasPendencias.filter((p) => p.vencida)
const aVencer = minhasPendencias.filter((p) => !p.vencida)

export function MinhasFichasPage() {
  const atual = minhasFichas[0]
  const devolvidos = useProntuarios().prontuarios.filter((p) => p.atuanteId === atuanteLogado.id && p.status === 'devolvido')

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

      {devolvidos.length > 0 && (
        <div className="mb-4">
          <Alert tom="aviso" titulo={devolvidos.length === 1 ? 'Prontuário devolvido com comentário' : `${devolvidos.length} prontuários devolvidos com comentário`}>
            {atuanteLogado.supervisor} pediu correção. Corrija e reenvie para a sessão contar como conferida.{' '}
            <Link to="/prontuarios" className="font-semibold underline underline-offset-2 hover:no-underline">
              Ver prontuários
            </Link>
          </Alert>
        </div>
      )}

      {(vencidas.length > 0 || aVencer.length > 0) && (
        <div className="mb-4">
          {vencidas.length > 0 ? (
            <Alert tom="erro" titulo="Acesso às salas bloqueado automaticamente">
              Você retirou a chave em {vencidas.map((p) => dataCurta(p.data)).join(', ')} e não declarou atendimento em {PRAZO_DECLARAR_DIAS} dias.
              Declare na ficha para liberar.
            </Alert>
          ) : (
            <Alert tom="aviso" titulo={`Atendimento sem declarar · faltam ${aVencer[0].diasRestantes} dias`}>
              Você retirou a chave em {aVencer.map((p) => dataCurta(p.data)).join(', ')} e ainda não há atendimento na ficha nesse dia. Declare até{' '}
              <strong>{dataCurta(aVencer[0].limite)}</strong>, ou o acesso às salas será bloqueado automaticamente.{' '}
              <Link to="/fichas/nova" className="font-semibold underline underline-offset-2 hover:no-underline">
                Declarar agora
              </Link>
            </Alert>
          )}
        </div>
      )}

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <Alert tom="info" titulo={`Ficha de ${nomeReferencia(atual.referencia)} em rascunho`}>
          Prazo de envio: <strong>{dataBR(prazoEnvio(atual.referencia))}</strong>. Você receberá um lembrete 2 dias antes.
        </Alert>
        <div className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Uso de salas</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Janela {dataCurta(janela.inicio)} → {dataCurta(janela.fim)}
              {minhaSala === 'aguardando' && ' · libera quando o supervisor validar a ficha de outubro'}
            </p>
          </div>
          <SituacaoSalaBadge situacao={minhaSala} />
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
