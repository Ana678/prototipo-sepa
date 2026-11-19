import { Link, useNavigate, useParams } from 'react-router-dom'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { StatTile } from '../../components/ui/StatTile'
import { StatusFichaBadge } from '../../components/ui/StatusBadge'
import { IconHistorico, IconNotificar, IconVoltar } from '../../components/ui/icons'
import { useToast } from '../../context/ToastContext'
import { obterFichaRegistro } from '../../data/mock'
import { dataBR, nomeReferencia, prazoEnvio } from '../../lib/datas'

/** Ficha de um atuante vista pelo Registro — destino dos links de pendência do Nada Consta e do Painel. */
export function FichaRegistroPage() {
  const { atuanteId = '', referencia = '' } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const dados = obterFichaRegistro(atuanteId, referencia)

  if (!dados) {
    return (
      <Alert tom="aviso" titulo="Ficha não encontrada">
        <Link to="/registro/painel" className="underline">Voltar ao painel do mês</Link>
      </Alert>
    )
  }

  const { ficha, atuante } = dados
  const pendente = ficha.status !== 'validada' && ficha.status !== 'aguardando_supervisor'

  return (
    <>
      <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-sepa-700 hover:underline dark:text-sepa-200">
        <IconVoltar size={18} /> Voltar
      </button>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-sepa-700 dark:text-sepa-200">Ficha de Acompanhamento Mensal</p>
          <h1 className="mt-0.5 text-2xl font-semibold tracking-tight text-slate-900 first-letter:uppercase dark:text-slate-50">
            {nomeReferencia(ficha.referencia)} · {atuante.nome}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {atuante.projeto ? `${atuante.vinculo} — ${atuante.projeto}` : atuante.vinculo} · Supervisão: {atuante.supervisor}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusFichaBadge status={ficha.status} />
          {pendente && (
            <Button onClick={() => toast(`Lembrete enviado para ${atuante.nome}.`)}>
              <IconNotificar size={18} /> Cobrar {atuante.nome.split(' ')[0]}
            </Button>
          )}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatTile rotulo="Prazo de envio" valor={dataBR(prazoEnvio(ficha.referencia))} />
        <StatTile rotulo="Usuários na ficha" valor={ficha.usuarios} />
        <StatTile rotulo="Sessões registradas" valor={ficha.sessoes} />
      </div>

      <Card titulo={<span className="inline-flex items-center gap-2"><IconHistorico size={20} /> Histórico da ficha</span>}>
        {ficha.eventos.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Nenhum registro ainda — a ficha não foi iniciada.</p>
        ) : (
          <ol className="space-y-3">
            {ficha.eventos.map((e) => (
              <li key={e.data + e.texto} className="flex gap-4">
                <span className="w-24 shrink-0 text-sm text-slate-500 tabular-nums dark:text-slate-400">{dataBR(e.data)}</span>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-50">{e.texto}</p>
                  {e.detalhe && <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">{e.detalhe}</p>}
                </div>
              </li>
            ))}
          </ol>
        )}
      </Card>
    </>
  )
}
