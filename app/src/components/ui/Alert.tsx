import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { IconOk, IconAlertaErro, IconAviso, IconInfo } from './icons'

const tons = {
  info: 'border-sepa-200 bg-sepa-50 text-sepa-900 dark:border-sepa-300/25 dark:bg-sepa-400/15 dark:text-sepa-100',
  aviso: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-100',
  erro: 'border-red-200 bg-red-50 text-red-900 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-100',
  ok: 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-100',
}

const icones = { info: IconInfo, aviso: IconAviso, erro: IconAlertaErro, ok: IconOk }

export function Alert({ tom = 'info', titulo, children }: { tom?: keyof typeof tons; titulo?: string; children: ReactNode }) {
  const Icone = icones[tom]
  return (
    <div className={cn('flex gap-3 rounded-lg border px-4 py-3 text-sm', tons[tom])} role={tom === 'erro' ? 'alert' : undefined}>
      <Icone size={20} className="mt-px shrink-0" />
      <div className="min-w-0">
        {titulo && <p className="font-semibold">{titulo}</p>}
        <div className={cn(titulo && 'mt-0.5')}>{children}</div>
      </div>
    </div>
  )
}
