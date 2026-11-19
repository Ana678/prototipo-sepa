import { Icon } from '../../components/ui/icons'
import { cn } from '../../lib/cn'
import { dataBR } from '../../lib/datas'
import type { EventoProntuario } from '../../types'

const ACAO: Record<EventoProntuario['acao'], { texto: string; icone: Parameters<typeof Icon>[0]['nome']; cor: string }> = {
  criado: { texto: 'Rascunho criado', icone: 'edit_note', cor: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' },
  enviado: { texto: 'Enviado ao supervisor', icone: 'send', cor: 'bg-sepa-50 text-sepa-700 dark:bg-sepa-400/15 dark:text-sepa-200' },
  reenviado: { texto: 'Corrigido e reenviado', icone: 'send', cor: 'bg-sepa-50 text-sepa-700 dark:bg-sepa-400/15 dark:text-sepa-200' },
  devolvido: { texto: 'Devolvido pelo supervisor', icone: 'undo', cor: 'bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300' },
  validado: { texto: 'Validado pelo supervisor', icone: 'check_circle', cor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300' },
}

/** Linha do tempo do prontuário: cada envio, devolução e validação, com os comentários. */
export function HistoricoProntuario({ eventos }: { eventos: EventoProntuario[] }) {
  return (
    <ol className="space-y-3">
      {eventos.map((e, i) => {
        const a = ACAO[e.acao]
        return (
          <li key={i} className="flex gap-3">
            <span className={cn('flex size-7 shrink-0 items-center justify-center rounded-full', a.cor)}>
              <Icon nome={a.icone} size={16} />
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-sm text-slate-800 dark:text-slate-100">
                <span className="font-medium">{a.texto}</span>
                <span className="text-slate-500 dark:text-slate-400"> · {e.autor} · {dataBR(e.em)}</span>
              </p>
              {e.comentario && (
                <p
                  className={cn(
                    'mt-1 rounded-lg px-3 py-2 text-sm',
                    e.acao === 'devolvido'
                      ? 'bg-amber-50 text-amber-900 ring-1 ring-amber-200 ring-inset dark:bg-amber-400/10 dark:text-amber-100 dark:ring-amber-400/20'
                      : 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
                  )}
                >
                  “{e.comentario}”
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

/** Aviso de sigilo, repetido onde o texto do prontuário aparece. */
export function AvisoSigilo() {
  return (
    <p className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
      <Icon nome="lock" size={14} /> Sigiloso: só quem atendeu e o supervisor leem
    </p>
  )
}
