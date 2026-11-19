import { useState } from 'react'

interface Item {
  rotulo: string
  valor: number
}

interface Props {
  dados: Item[]
  /** Texto do tooltip, ex.: "atendimentos" */
  unidade: string
  /** Mostra % do total ao lado do valor. */
  mostrarPercentual?: boolean
}

/**
 * Barras horizontais de uma série só (magnitude) — uma cor, sem legenda (o título do card nomeia a série).
 * Hover mostra o valor exato; a tabela de dados fica disponível na própria página.
 */
export function BarChart({ dados, unidade, mostrarPercentual = false }: Props) {
  const [ativo, setAtivo] = useState<string | null>(null)
  const max = Math.max(...dados.map((d) => d.valor), 1)
  const total = dados.reduce((s, d) => s + d.valor, 0)
  const fmt = new Intl.NumberFormat('pt-BR')

  return (
    <ul className="space-y-2.5" role="list">
      {dados.map((d) => {
        const pct = total ? (d.valor / total) * 100 : 0
        return (
          <li
            key={d.rotulo}
            className="group relative grid grid-cols-[1fr_5.5rem] items-center gap-x-3 gap-y-1 rounded-md py-0.5 sm:grid-cols-[11.5rem_1fr_5.5rem]"
            onMouseEnter={() => setAtivo(d.rotulo)}
            onMouseLeave={() => setAtivo(null)}
            onFocus={() => setAtivo(d.rotulo)}
            onBlur={() => setAtivo(null)}
            tabIndex={0}
            aria-label={`${d.rotulo}: ${fmt.format(d.valor)} ${unidade}`}
          >
            {/* no celular o rótulo fica numa linha própria, acima da barra */}
            <span className="col-span-2 truncate text-sm text-slate-600 sm:col-span-1 dark:text-slate-300">{d.rotulo}</span>
            <span className="relative h-5">
              <span
                className="absolute inset-y-0 left-0 rounded-r-[4px] bg-sepa-600 transition-opacity group-hover:bg-sepa-700 dark:bg-sepa-400 dark:group-hover:bg-sepa-300"
                style={{ width: `${Math.max((d.valor / max) * 100, 0.8)}%`, opacity: ativo && ativo !== d.rotulo ? 0.45 : 1 }}
              />
            </span>
            <span className="text-right text-sm font-medium text-slate-800 dark:text-slate-100 tabular-nums">
              {fmt.format(d.valor)}
              {mostrarPercentual && <span className="ml-1 text-xs font-normal text-slate-500 dark:text-slate-400">{pct.toFixed(1)}%</span>}
            </span>
            {ativo === d.rotulo && (
              <span className="pointer-events-none absolute -top-9 left-0 z-10 max-sm:hidden sm:left-36 rounded-md bg-slate-900 dark:bg-slate-700 px-2.5 py-1 text-xs whitespace-nowrap text-white shadow">
                {d.rotulo}: <strong>{fmt.format(d.valor)}</strong> {unidade} ({pct.toFixed(1)}%)
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
