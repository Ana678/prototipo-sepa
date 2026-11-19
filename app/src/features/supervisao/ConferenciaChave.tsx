import { Icon } from '../../components/ui/icons'
import { cn } from '../../lib/cn'
import { nomeReferencia } from '../../lib/datas'
import { dataCurta } from '../permissao/permissoes'
import { PRAZO_DECLARAR_DIAS } from '../permissao/regraPermissao'
import { declaracaoDe } from '../registro/cruzamentoUsoSala'

const lista = (datas: string[]) => {
  const d = datas.map(dataCurta)
  return d.length > 1 ? `${d.slice(0, -1).join(', ')} e ${d.at(-1)}` : d[0]
}

/**
 * Dias em que o aluno retirou chave × atendimentos declarados na ficha.
 * Retirada sem atendimento declarado em até 15 dias → bloqueio automático das salas.
 * Retiradas vêm do módulo de Reserva de Salas (outro grupo). Só datas, nada de usuário atendido.
 */
export function ConferenciaChave({ atuanteId, nome, referencia }: { atuanteId: string; nome: string; referencia: string }) {
  const { diasComChave, declaradas, pendencias } = declaracaoDe(atuanteId)
  const primeiro = nome.split(' ')[0]
  const doMes = diasComChave.filter((d) => d.startsWith(referencia))
  const pendPorData = new Map(pendencias.map((p) => [p.data, p]))
  const vencidas = pendencias.filter((p) => p.vencida)
  const aVencer = pendencias.filter((p) => !p.vencida)
  const declarados = doMes.filter((d) => declaradas.has(d)).length
  /** Datas de outro mês ganham o aviso "(ficha de novembro)", para não parecer que vieram do nada. */
  const comMes = (datas: string[]) => {
    const fora = datas.filter((d) => !d.startsWith(referencia))
    const mes = fora.length ? nomeReferencia(fora[0].slice(0, 7)).split('/')[0] : ''
    return `${lista(datas)}${fora.length ? ` (ficha de ${mes})` : ''}`
  }

  return (
    <section>
      <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
        <Icon nome="key" size={16} /> Retiradas de chave no mês
        {doMes.length > 0 && (
          <span className="font-normal normal-case">
            · {declarados} de {doMes.length} com atendimento declarado
          </span>
        )}
      </h3>

      {doMes.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">Nenhuma retirada de chave neste mês.</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {doMes.map((d) => {
            const p = pendPorData.get(d)
            return (
              <span
                key={d}
                title={p ? (p.vencida ? `Sem declarar há mais de ${PRAZO_DECLARAR_DIAS} dias` : `Declarar até ${dataCurta(p.limite)}`) : 'Atendimento declarado'}
                className={cn(
                  'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-sm tabular-nums',
                  !p && 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
                  p?.vencida && 'bg-red-50 text-red-800 ring-1 ring-red-300 ring-inset dark:bg-red-400/10 dark:text-red-200 dark:ring-red-400/30',
                  p && !p.vencida && 'bg-amber-50 text-amber-900 ring-1 ring-amber-300 ring-inset dark:bg-amber-400/10 dark:text-amber-200 dark:ring-amber-400/30',
                )}
              >
                {p && <Icon nome={p.vencida ? 'block' : 'hourglass_top'} size={14} />}
                {dataCurta(d)}
              </span>
            )
          })}
        </div>
      )}

      {doMes.length > 0 && !doMes.some((d) => pendPorData.has(d)) && (
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Todas as retiradas deste mês têm atendimento declarado.</p>
      )}

      {/* Pendências da pessoa — inclusive de outros meses, sempre dizendo que houve retirada de chave */}
      {vencidas.length > 0 && (
        <p className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-900 dark:bg-red-400/10 dark:text-red-100">
          <Icon nome="block" size={18} className="mt-px shrink-0 text-red-600 dark:text-red-300" />
          <span>
            <strong className="font-semibold">Acesso às salas bloqueado.</strong> {primeiro} retirou a chave em {comMes(vencidas.map((p) => p.data))} e
            não declarou {vencidas.length > 1 ? 'os atendimentos desses dias' : 'o atendimento desse dia'} em {PRAZO_DECLARAR_DIAS} dias. Libera assim que declarar na ficha.
          </span>
        </p>
      )}
      {aVencer.length > 0 && (
        <p className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:bg-amber-400/10 dark:text-amber-100">
          <Icon nome="hourglass_top" size={18} className="mt-px shrink-0 text-amber-600 dark:text-amber-300" />
          <span>
            {primeiro} retirou a chave em {comMes(aVencer.map((p) => p.data))} e ainda não declarou {aVencer.length > 1 ? 'os atendimentos desses dias' : 'o atendimento desse dia'}. Prazo:{' '}
            <strong className="font-semibold">{dataCurta(aVencer[0].limite)}</strong> (faltam {aVencer[0].diasRestantes} dias). Depois disso, o acesso às
            salas é bloqueado automaticamente.
          </span>
        </p>
      )}
    </section>
  )
}
