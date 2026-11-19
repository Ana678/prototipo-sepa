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
  /** No celular: cartões (padrão) ou a própria tabela com rolagem lateral (bom para matrizes de números). */
  celular?: 'cartoes' | 'tabela'
}

export function DataTable<T>({ colunas, linhas, chaveLinha, vazio = 'Nenhum registro.', porPagina: porPaginaInicial = 10, celular = 'cartoes' }: Props<T>) {
  const paginar = porPaginaInicial !== false
  const [porPagina, setPorPagina] = useState(porPaginaInicial || 10)
  const [paginaPedida, setPagina] = useState(1)

  // se um filtro reduzir a lista, a página atual nunca fica além da última
  const totalPaginas = Math.max(1, Math.ceil(linhas.length / porPagina))
  const pagina = Math.min(paginaPedida, totalPaginas)
  const visiveis = paginar ? linhas.slice((pagina - 1) * porPagina, pagina * porPagina) : linhas

  return (
    <div>
    {/* Celular: cada linha vira um cartão (1ª coluna como título, as demais como rótulo: valor) */}
    <ul className={cn('divide-y divide-slate-100 md:hidden dark:divide-slate-800', celular === 'tabela' && 'hidden')}>
      {linhas.length === 0 && <li className="px-1 py-6 text-center text-sm text-slate-500 dark:text-slate-400">{vazio}</li>}
      {visiveis.map((l) => {
        const [primeira, ...resto] = colunas
        return (
          <li key={chaveLinha(l)} className="py-3 text-sm">
            <div className="mb-2">{primeira.render(l)}</div>
            <dl className="grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-x-3 gap-y-1.5">
              {resto.map((c) => {
                const valor = c.render(l)
                if (valor == null || valor === '' || valor === false) return null
                return (
                  <div key={c.chave} className="contents">
                    <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">{c.titulo}</dt>
                    <dd className={cn('min-w-0', c.alinhar === 'direita' && 'tabular-nums')}>{valor}</dd>
                  </div>
                )
              })}
            </dl>
          </li>
        )
      })}
    </ul>
    <div className={cn('overflow-x-auto', celular === 'cartoes' && 'hidden md:block')}>
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
