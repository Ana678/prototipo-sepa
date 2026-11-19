import type { ReactNode } from 'react'
import { Icon } from '../../components/ui/icons'
import { cn } from '../../lib/cn'
import { FONTES, type Fonte } from './dadosRelatorio'

const ESTILO_FONTE: Record<Fonte, string> = {
  ficha: 'bg-sepa-50 text-sepa-800 ring-sepa-200 dark:bg-sepa-400/15 dark:text-sepa-200 dark:ring-sepa-300/30',
  atividades: 'bg-sepa-50 text-sepa-800 ring-sepa-200 dark:bg-sepa-400/15 dark:text-sepa-200 dark:ring-sepa-300/30',
  sigaa: 'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-400/10 dark:text-slate-300 dark:ring-slate-400/20',
  cadastro: 'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-400/10 dark:text-slate-300 dark:ring-slate-400/20',
  aDefinir: 'bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/20',
}

const ICONE_FONTE: Record<Fonte, 'description' | 'event_note' | 'cloud' | 'badge' | 'help'> = {
  ficha: 'description',
  atividades: 'event_note',
  sigaa: 'cloud',
  cadastro: 'badge',
  aDefinir: 'help',
}

/** De onde vem o número. Fontes fora da ficha ficam visíveis, em vez de parecerem automáticas. */
export function FonteBadge({ fonte }: { fonte: Fonte }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset', ESTILO_FONTE[fonte])}>
      <Icon nome={ICONE_FONTE[fonte]} size={14} />
      {FONTES[fonte]}
    </span>
  )
}

/** Bloco do relatório numerado como no documento oficial. */
export function Secao({ numero, titulo, referencia, fonte, children }: { numero: number; titulo: string; referencia?: string; fonte: Fonte; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <header className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-sepa-600 text-xs font-semibold text-white dark:bg-sepa-400 dark:text-sepa-950">{numero}</span>
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">{titulo}</h2>
        {referencia && <span className="text-xs text-slate-500 dark:text-slate-400">{referencia}</span>}
        <span className="ml-auto">
          <FonteBadge fonte={fonte} />
        </span>
      </header>
      <div className="px-5 py-4">{children}</div>
    </section>
  )
}

/** Título pequeno dentro de uma seção. */
export function Subtitulo({ children }: { children: ReactNode }) {
  return <h3 className="mb-3 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">{children}</h3>
}
