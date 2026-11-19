import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface Props {
  titulo?: ReactNode
  descricao?: ReactNode
  acoes?: ReactNode
  children: ReactNode
  className?: string
}

export function Card({ titulo, descricao, acoes, children, className }: Props) {
  return (
    <section className={cn('rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm', className)}>
      {(titulo || acoes) && (
        <header className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3 border-b border-slate-100 dark:border-slate-800 px-4 py-4 sm:px-5">
          <div>
            {titulo && <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">{titulo}</h2>}
            {descricao && <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{descricao}</p>}
          </div>
          {acoes && <div className="flex shrink-0 gap-2">{acoes}</div>}
        </header>
      )}
      <div className="px-4 py-4 sm:px-5">{children}</div>
    </section>
  )
}
