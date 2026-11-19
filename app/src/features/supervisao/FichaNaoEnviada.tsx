import { Button } from '../../components/ui/Button'
import { Icon, IconNotificar } from '../../components/ui/icons'
import { Badge } from '../../components/ui/StatusBadge'
import { cn } from '../../lib/cn'
import type { LinhaPainel } from '../../data/mock'
import { dataBR, nomeReferencia, prazoEnvio } from '../../lib/datas'
import { ConferenciaChave } from './ConferenciaChave'
import { declaracaoDe } from '../registro/cruzamentoUsoSala'

const REFERENCIA = '2026-10'

/** Ficha de um aluno supervisionado que passou do prazo sem ser enviada (não iniciada ou em rascunho). */
export function FichaNaoEnviada({ linha, onCobrar }: { linha: LinhaPainel; onCobrar: () => void }) {
  const { atuante } = linha
  const primeiro = atuante.nome.split(' ')[0]
  const rascunho = linha.status !== 'nao_enviada'
  const bloqueado = declaracaoDe(atuante.id).pendencias.some((p) => p.vencida)

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-start justify-between gap-6 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{atuante.nome}</h2>
          <p className="text-sm text-slate-500 first-letter:uppercase dark:text-slate-400">
            Ficha de {nomeReferencia(REFERENCIA)} · {atuante.vinculo} · prazo era {dataBR(prazoEnvio(REFERENCIA))}
          </p>
        </div>
        <Badge tom={bloqueado ? 'erro' : 'aviso'}>{rascunho ? 'Rascunho não enviado' : 'Não iniciada'}</Badge>
      </header>

      <div className="flex-1 space-y-5 overflow-y-auto py-5">
        <p
          className={cn(
            'flex items-start gap-2 rounded-lg px-3 py-2 text-sm',
            bloqueado ? 'bg-red-50 text-red-900 dark:bg-red-400/10 dark:text-red-100' : 'bg-amber-50 text-amber-900 dark:bg-amber-400/10 dark:text-amber-100',
          )}
        >
          <Icon nome="schedule" size={20} className={cn('shrink-0', bloqueado ? 'text-red-600 dark:text-red-300' : 'text-amber-600 dark:text-amber-300')} />
          {rascunho
            ? `${primeiro} começou a ficha mas não enviou: ${linha.sessoes ?? 0} sessões lançadas em ${linha.datasFicha?.length ?? 0} dias. Você só confere depois do envio.`
            : `${primeiro} ainda não lançou nenhum atendimento de ${nomeReferencia(REFERENCIA)}.`}
        </p>

        {rascunho && !!linha.datasFicha?.length && (
          <section>
            <h3 className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">Dias lançados no rascunho</h3>
            <div className="flex flex-wrap gap-1.5">
              {linha.datasFicha.map((d) => (
                <span key={d} className="rounded-md bg-slate-100 px-2 py-0.5 text-sm tabular-nums text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {d}
                </span>
              ))}
            </div>
          </section>
        )}

        <ConferenciaChave atuanteId={atuante.id} nome={atuante.nome} referencia={REFERENCIA} />
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <p className="flex min-w-64 flex-1 items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
          <Icon nome={bloqueado ? 'key_off' : 'key'} size={18} />
          {bloqueado
            ? `Acesso às salas bloqueado: ${primeiro} retirou a chave e não declarou o atendimento em 15 dias.`
            : `Sem bloqueio: ${primeiro} não retirou chave sem declarar o atendimento.`}
        </p>
        <Button onClick={onCobrar} className="shrink-0 whitespace-nowrap">
          <IconNotificar size={18} /> Cobrar {primeiro}
        </Button>
      </footer>
    </div>
  )
}
