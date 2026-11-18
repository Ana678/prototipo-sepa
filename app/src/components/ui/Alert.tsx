import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { IconOk, IconAlertaErro, IconAviso, IconInfo } from './icons'

const tons = {
  info: 'border-sepa-200 dark:border-sepa-700 bg-sepa-50 dark:bg-sepa-900/50 text-sepa-900 dark:text-sepa-100',
  aviso: 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200',
  erro: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50 text-red-900 dark:text-red-200',
  ok: 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200',
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
