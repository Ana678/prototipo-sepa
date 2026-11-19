import { cn } from '../../lib/cn'
import { Icon } from './icons'
import { SelectMenu } from './SelectMenu'

interface Props {
  pagina: number
  totalItens: number
  porPagina: number
  opcoesPorPagina?: number[]
  onPagina: (p: number) => void
  onPorPagina: (n: number) => void
}

/** Páginas visíveis com reticências: 1 … 4 5 [6] 7 8 … 12 */
function paginasVisiveis(atual: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const meio = [atual - 1, atual, atual + 1].filter((p) => p > 1 && p < total)
  const r: (number | '…')[] = [1]
  if (meio[0] > 2) r.push('…')
  r.push(...meio)
  if (meio[meio.length - 1] < total - 1) r.push('…')
  r.push(total)
  return r
}

const botao =
  'flex size-8 items-center justify-center rounded-lg text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-35 dark:text-slate-300 dark:hover:bg-slate-800'

export function Pagination({ pagina, totalItens, porPagina, opcoesPorPagina = [5, 10, 25, 50], onPagina, onPorPagina }: Props) {
  const totalPaginas = Math.max(1, Math.ceil(totalItens / porPagina))
  const inicio = totalItens === 0 ? 0 : (pagina - 1) * porPagina + 1
  const fim = Math.min(pagina * porPagina, totalItens)

  return (
    <nav aria-label="Paginação" className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 px-3 pt-4 dark:border-slate-800">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Mostrando <strong className="font-semibold text-slate-800 tabular-nums dark:text-slate-100">{inicio}–{fim}</strong> de{' '}
        <strong className="font-semibold text-slate-800 tabular-nums dark:text-slate-100">{totalItens}</strong>
      </p>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          Linhas por página
          <SelectMenu
            ariaLabel="Linhas por página"
            tamanho="sm"
            className="w-20"
            value={String(porPagina)}
            onChange={(v) => onPorPagina(Number(v))}
            opcoes={opcoesPorPagina.map((n) => ({ valor: String(n), rotulo: String(n) }))}
          />
        </div>

        <div className="flex items-center gap-1">
          <button className={botao} onClick={() => onPagina(1)} disabled={pagina === 1} aria-label="Primeira página">
            <Icon nome="first_page" size={20} />
          </button>
          <button className={botao} onClick={() => onPagina(pagina - 1)} disabled={pagina === 1} aria-label="Página anterior">
            <Icon nome="chevron_left" size={20} />
          </button>
          {paginasVisiveis(pagina, totalPaginas).map((p, i) =>
            p === '…' ? (
              <span key={`r${i}`} className="flex size-8 items-center justify-center text-sm text-slate-400">…</span>
            ) : (
              <button
                key={p}
                onClick={() => onPagina(p)}
                aria-current={p === pagina ? 'page' : undefined}
                className={cn(botao, 'tabular-nums', p === pagina && 'bg-sepa-600 text-white hover:bg-sepa-700 dark:bg-sepa-500 dark:text-white dark:hover:bg-sepa-400')}
              >
                {p}
              </button>
            ),
          )}
          <button className={botao} onClick={() => onPagina(pagina + 1)} disabled={pagina === totalPaginas} aria-label="Próxima página">
            <Icon nome="chevron_right" size={20} />
          </button>
          <button className={botao} onClick={() => onPagina(totalPaginas)} disabled={pagina === totalPaginas} aria-label="Última página">
            <Icon nome="last_page" size={20} />
          </button>
        </div>
      </div>
    </nav>
  )
}
