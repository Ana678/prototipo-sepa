import type { ReactNode } from 'react'

interface Props {
  titulo: string
  subtitulo?: ReactNode
  acoes?: ReactNode
}

export function PageHeader({ titulo, subtitulo, acoes }: Props) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">{titulo}</h1>
        {subtitulo && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitulo}</p>}
      </div>
      {acoes && <div className="flex gap-2">{acoes}</div>}
    </div>
  )
}
