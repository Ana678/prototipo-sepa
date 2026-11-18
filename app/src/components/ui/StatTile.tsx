import type { ReactNode } from 'react'

interface Props {
  rotulo: string
  valor: ReactNode
  detalhe?: ReactNode
}

export function StatTile({ rotulo, valor, detalhe }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-4 shadow-sm">
      <p className="text-sm text-slate-500 dark:text-slate-400">{rotulo}</p>
      <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 tabular-nums">{valor}</p>
      {detalhe && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{detalhe}</p>}
    </div>
  )
}
