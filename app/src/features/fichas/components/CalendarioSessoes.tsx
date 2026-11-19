import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { IconAdicionar } from '../../../components/ui/icons'
import { cn } from '../../../lib/cn'
import { HOJE } from '../../../data/mock'

interface Props {
  /** Primeiro e último dia do mês da ficha (ISO). */
  limites: { min: string; max: string }
  /** Datas já registradas para o usuário (ISO). */
  selecionadas: string[]
  onAdicionar: (data: string) => void
  /** Pede confirmação antes de tirar (quem chama decide). */
  onRemover: (data: string) => void
}

const SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']

/**
 * Calendário só do mês da ficha: clicar num dia marca a sessão; clicar de novo tira.
 * Substitui o <input type="date"> nativo (pequeno e uma data por vez).
 */
export function CalendarioSessoes({ limites, selecionadas, onAdicionar, onRemover }: Props) {
  const [ano, mes] = limites.min.split('-').map(Number)
  const diasNoMes = Number(limites.max.slice(8, 10))
  const primeiroDiaSemana = new Date(Date.UTC(ano, mes - 1, 1)).getUTCDay()
  const iso = (d: number) => `${limites.min.slice(0, 8)}${String(d).padStart(2, '0')}`
  const marcadas = new Set(selecionadas)
  const doMes = selecionadas.filter((d) => d >= limites.min && d <= limites.max).length

  return (
    <Popover className="relative">
      <PopoverButton className="inline-flex items-center gap-1 rounded-md border border-dashed border-slate-300 px-2 py-1 text-xs font-medium text-slate-500 hover:border-sepa-400 hover:text-sepa-700 focus:outline-none data-focus:ring-2 data-focus:ring-sepa-200 data-open:border-sepa-500 data-open:text-sepa-700 dark:border-slate-600 dark:text-slate-400 dark:hover:text-sepa-200 dark:data-focus:ring-sepa-800 dark:data-open:text-sepa-200">
        <IconAdicionar size={14} /> data
      </PopoverButton>

      <PopoverPanel
        anchor={{ to: 'bottom start', gap: 8, padding: 12 }}
        transition
        className="z-50 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-lg ring-1 ring-black/5 transition duration-100 ease-out data-closed:scale-95 data-closed:opacity-0 dark:border-slate-700 dark:bg-slate-900 dark:ring-white/5"
      >
        {({ close }) => (
          <>
            <div className="mb-3 flex items-baseline justify-between">
              <p className="text-sm font-semibold text-slate-900 capitalize dark:text-slate-50">
                {MESES[mes - 1]} {ano}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{doMes === 1 ? '1 sessão' : `${doMes} sessões`}</p>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {SEMANA.map((d, i) => (
                <span key={i} className="pb-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                  {d}
                </span>
              ))}
              {Array.from({ length: primeiroDiaSemana }, (_, i) => (
                <span key={`v${i}`} />
              ))}
              {Array.from({ length: diasNoMes }, (_, i) => {
                const dia = i + 1
                const data = iso(dia)
                const marcada = marcadas.has(data)
                const futura = data > HOJE
                return (
                  <button
                    key={dia}
                    type="button"
                    disabled={futura}
                    aria-pressed={marcada}
                    aria-label={`${dia} de ${MESES[mes - 1]}${marcada ? ', sessão registrada' : ''}`}
                    onClick={() => (marcada ? onRemover(data) : onAdicionar(data))}
                    className={cn(
                      'flex size-8 items-center justify-center rounded-lg text-sm tabular-nums transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sepa-400',
                      marcada
                        ? 'bg-sepa-600 font-semibold text-white hover:bg-sepa-700 dark:bg-sepa-400 dark:text-sepa-950 dark:hover:bg-sepa-300'
                        : futura
                          ? 'cursor-not-allowed text-slate-300 dark:text-slate-600'
                          : 'text-slate-700 hover:bg-sepa-50 hover:text-sepa-800 dark:text-slate-200 dark:hover:bg-sepa-900/60 dark:hover:text-white',
                      data === HOJE && !marcada && 'ring-1 ring-sepa-300 ring-inset dark:ring-sepa-600',
                    )}
                  >
                    {dia}
                  </button>
                )
              })}
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">Clique nos dias das sessões</p>
              <button
                type="button"
                onClick={() => close()}
                className="rounded-md bg-sepa-600 px-3 py-1 text-xs font-medium text-white hover:bg-sepa-700 dark:bg-sepa-500 dark:hover:bg-sepa-400"
              >
                Pronto
              </button>
            </div>
          </>
        )}
      </PopoverPanel>
    </Popover>
  )
}
