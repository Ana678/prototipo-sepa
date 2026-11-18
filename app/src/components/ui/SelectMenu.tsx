import { Field, Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { cn } from '../../lib/cn'
import { Icon, type IconeComponente } from './icons'

export type TomOpcao = 'neutro' | 'info' | 'aviso' | 'ok'

export interface Opcao<T extends string = string> {
  valor: T
  rotulo: string
  descricao?: string
  icone?: IconeComponente
  /** Destaca o botão quando esta opção está selecionada (ex.: "Perdeu a vaga"). */
  tom?: TomOpcao
}

interface Props<T extends string> {
  value: T
  onChange: (valor: T) => void
  opcoes: Opcao<T>[]
  label?: string
  /** Para quando não há label visível. */
  ariaLabel?: string
  placeholder?: string
  tamanho?: 'sm' | 'md'
  className?: string
  disabled?: boolean
}

const TOM_BOTAO: Record<TomOpcao, string> = {
  neutro: '',
  info: 'border-sepa-300 bg-sepa-50 text-sepa-800 dark:border-sepa-600 dark:bg-sepa-900/50 dark:text-sepa-100',
  aviso: 'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-200',
  ok: 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200',
}

const TOM_PONTO: Record<TomOpcao, string> = {
  neutro: 'bg-slate-300 dark:bg-slate-600',
  info: 'bg-sepa-500 dark:bg-sepa-300',
  aviso: 'bg-amber-500',
  ok: 'bg-emerald-500',
}

/**
 * Select do sistema — substitui o <select> nativo.
 * Baseado no Listbox do Headless UI: navegação por teclado, leitor de tela e foco já resolvidos.
 */
export function SelectMenu<T extends string>({
  value,
  onChange,
  opcoes,
  label,
  ariaLabel,
  placeholder = 'Selecione…',
  tamanho = 'md',
  className,
  disabled,
}: Props<T>) {
  const atual = opcoes.find((o) => o.valor === value)
  const tom = atual?.tom ?? 'neutro'
  const usaTom = opcoes.some((o) => o.tom)

  return (
    <Field className={className} disabled={disabled}>
      {label && <Label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{label}</Label>}
      <Listbox value={value} onChange={onChange}>
        <ListboxButton
          aria-label={label ? undefined : ariaLabel}
          className={cn(
            'group flex w-full items-center gap-2 rounded-lg border text-left transition-colors focus:outline-none data-focus:ring-2 data-focus:ring-sepa-200 dark:data-focus:ring-sepa-800 data-disabled:cursor-not-allowed data-disabled:opacity-60',
            tamanho === 'sm' ? 'px-2.5 py-1.5 text-sm' : 'px-3 py-2 text-sm',
            tom === 'neutro'
              ? 'border-slate-300 bg-white text-slate-900 hover:border-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-500'
              : TOM_BOTAO[tom],
            'data-open:border-sepa-500 dark:data-open:border-sepa-400',
          )}
        >
          {atual?.icone ? <atual.icone size={18} className="opacity-80" /> : usaTom && atual && <span className={cn('size-2 shrink-0 rounded-full', TOM_PONTO[tom])} />}
          <span className={cn('min-w-0 flex-1 truncate', !atual && 'text-slate-400 dark:text-slate-500')}>{atual?.rotulo ?? placeholder}</span>
          <Icon nome="keyboard_arrow_down" size={20} className="text-slate-400 transition-transform group-data-open:rotate-180 dark:text-slate-500" />
        </ListboxButton>

        <ListboxOptions
          anchor={{ to: 'bottom start', gap: 6 }}
          transition
          className="z-50 max-h-72 w-(--button-width) min-w-48 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg ring-1 ring-black/5 transition duration-100 ease-out [--anchor-max-height:18rem] focus:outline-none data-closed:scale-95 data-closed:opacity-0 dark:border-slate-700 dark:bg-slate-900 dark:ring-white/5"
        >
          {opcoes.map((o) => (
            <ListboxOption
              key={o.valor}
              value={o.valor}
              className="group flex cursor-pointer items-start gap-2.5 rounded-lg px-2.5 py-2 text-sm text-slate-700 select-none data-focus:bg-sepa-50 data-focus:text-sepa-900 data-selected:font-medium dark:text-slate-200 dark:data-focus:bg-sepa-900/50 dark:data-focus:text-white"
            >
              {o.icone ? (
                <o.icone size={18} className="mt-px text-slate-400 group-data-focus:text-sepa-600 dark:group-data-focus:text-sepa-200" />
              ) : (
                usaTom && <span className={cn('mt-1.5 size-2 shrink-0 rounded-full', TOM_PONTO[o.tom ?? 'neutro'])} />
              )}
              <span className="min-w-0 flex-1">
                <span className="block">{o.rotulo}</span>
                {o.descricao && <span className="block text-xs font-normal text-slate-500 dark:text-slate-400">{o.descricao}</span>}
              </span>
              <Icon nome="check" size={18} className="invisible mt-px text-sepa-600 group-data-selected:visible dark:text-sepa-300" />
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </Field>
  )
}

/** Atalho para listas simples de textos. */
// eslint-disable-next-line react-refresh/only-export-components
export function opcoesDe<T extends string>(valores: readonly T[]): Opcao<T>[] {
  return valores.map((v) => ({ valor: v, rotulo: v }))
}
