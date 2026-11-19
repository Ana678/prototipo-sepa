import { useState, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Pagination } from './Pagination'

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
  /** Linhas por página. `false` desliga a paginação. Padrão: 10. */
  porPagina?: number | false
}

export function DataTable<T>({ colunas, linhas, chaveLinha, vazio = 'Nenhum registro.', porPagina: porPaginaInicial = 10 }: Props<T>) {
  const paginar = porPaginaInicial !== false
  const [porPagina, setPorPagina] = useState(porPaginaInicial || 10)
  const [paginaPedida, setPagina] = useState(1)

  // se um filtro reduzir a lista, a página atual nunca fica além da última
  const totalPaginas = Math.max(1, Math.ceil(linhas.length / porPagina))
  const pagina = Math.min(paginaPedida, totalPaginas)
  const visiveis = paginar ? linhas.slice((pagina - 1) * porPagina, pagina * porPagina) : linhas

  return (
    <div>
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
          {visiveis.map((l) => (
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
      {paginar && linhas.length > 0 && (
        <Pagination
          pagina={pagina}
          totalItens={linhas.length}
          porPagina={porPagina}
          onPagina={setPagina}
          onPorPagina={(n) => {
            setPorPagina(n)
            setPagina(1)
          }}
        />
      )}
    </div>
  )
}
