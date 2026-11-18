import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface Coluna<T> {
  chave: string
  titulo: ReactNode
  render: (linha: T) => ReactNode
  alinhar?: 'esquerda' | 'direita'
}

interface Props<T> {
  colunas: Coluna<T>[]
  linhas: T[]
  chaveLinha: (linha: T) => string
  vazio?: string
}

export function DataTable<T>({ colunas, linhas, chaveLinha, vazio = 'Nenhum registro.' }: Props<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 text-xs tracking-wide text-slate-500 dark:text-slate-400 uppercase">
            {colunas.map((c) => (
              <th key={c.chave} className={cn('px-3 py-2 font-medium', c.alinhar === 'direita' && 'text-right')}>
                {c.titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {linhas.length === 0 && (
            <tr>
              <td colSpan={colunas.length} className="px-3 py-6 text-center text-slate-500 dark:text-slate-400">
                {vazio}
              </td>
            </tr>
          )}
          {linhas.map((l) => (
            <tr key={chaveLinha(l)} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/60">
              {colunas.map((c) => (
                <td key={c.chave} className={cn('px-3 py-2.5 align-top', c.alinhar === 'direita' && 'text-right tabular-nums')}>
                  {c.render(l)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
