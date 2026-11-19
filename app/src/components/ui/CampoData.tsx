import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { useState } from 'react'
import { cn } from '../../lib/cn'
import { dataBR } from '../../lib/datas'
import { Icon, IconCalendario } from './icons'

interface Props {
  id?: string
  value: string
  onChange: (iso: string) => void
  /** Último dia que pode ser escolhido (ex.: hoje: não se registra sessão futura). */
  max?: string
  disabled?: boolean
}

const SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
const doisDig = (n: number) => String(n).padStart(2, '0')

/** Campo de UMA data com calendário próprio (o <input type="date"> nativo fica pequeno e esticado). */
export function CampoData({ id, value, onChange, max, disabled }: Props) {
  const base = value || max || new Date().toISOString().slice(0, 10)
  const [vista, setVista] = useState(() => ({ ano: Number(base.slice(0, 4)), mes: Number(base.slice(5, 7)) }))
  const { ano, mes } = vista
  const diasNoMes = new Date(ano, mes, 0).getDate()
  const primeiroDia = new Date(ano, mes - 1, 1).getDay()
  const iso = (d: number) => `${ano}-${doisDig(mes)}-${doisDig(d)}`
  const proximoBloqueado = !!max && iso(diasNoMes) >= max
  const andar = (delta: number) => {
    const m = mes + delta
    setVista({ ano: ano + Math.floor((m - 1) / 12), mes: ((m - 1 + 12) % 12) + 1 })
  }

  return (
    <Popover className="relative">
      <PopoverButton
        id={id}
        disabled={disabled}
        className="flex w-full items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-left text-sm text-slate-900 focus:border-sepa-500 focus:ring-2 focus:ring-sepa-200 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-50 dark:focus:ring-sepa-800 dark:disabled:bg-slate-800"
      >
        <IconCalendario size={18} className="text-slate-400" />
        <span className={cn('flex-1 tabular-nums', !value && 'text-slate-400')}>{value ? dataBR(value) : 'Escolha a data'}</span>
      </PopoverButton>
      <PopoverPanel
        anchor={{ to: 'bottom start', gap: 6, padding: 12 }}
        className="z-[60] w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-900"
      >
        {({ close }) => (
          <>
            <div className="mb-3 flex items-center justify-between">
              <button type="button" aria-label="Mês anterior" onClick={() => andar(-1)} className="flex size-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                <Icon nome="chevron_left" size={20} />
              </button>
              <p className="text-sm font-semibold text-slate-900 capitalize dark:text-slate-50">
                {MESES[mes - 1]} {ano}
              </p>
              <button
                type="button"
                aria-label="Próximo mês"
                disabled={proximoBloqueado}
                onClick={() => andar(1)}
                className="flex size-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800"
              >
                <Icon nome="chevron_right" size={20} />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {SEMANA.map((d, i) => (
                <span key={i} className="pb-1 text-[11px] font-medium text-slate-400">{d}</span>
              ))}
              {Array.from({ length: primeiroDia }, (_, i) => <span key={`v${i}`} />)}
              {Array.from({ length: diasNoMes }, (_, i) => {
                const d = iso(i + 1)
                const futura = !!max && d > max
                const sel = d === value
                return (
                  <button
                    key={d}
                    type="button"
                    disabled={futura}
                    aria-pressed={sel}
                    aria-label={dataBR(d)}
                    onClick={() => {
                      onChange(d)
                      close()
                    }}
                    className={cn(
                      'flex size-8 items-center justify-center rounded-lg text-sm tabular-nums',
                      sel
                        ? 'bg-sepa-600 font-semibold text-white dark:bg-sepa-400 dark:text-sepa-950'
                        : futura
                          ? 'cursor-not-allowed text-slate-300 dark:text-slate-600'
                          : 'text-slate-700 hover:bg-sepa-50 dark:text-slate-200 dark:hover:bg-sepa-900/60',
                    )}
                  >
                    {i + 1}
                  </button>
                )
              })}
            </div>
          </>
        )}
      </PopoverPanel>
    </Popover>
  )
}
