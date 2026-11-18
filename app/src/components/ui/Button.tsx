import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type Variante = 'primario' | 'secundario' | 'fantasma' | 'perigo'

const estilos: Record<Variante, string> = {
  primario: 'bg-sepa-600 text-white hover:bg-sepa-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 dark:disabled:text-slate-400',
  secundario: 'border border-sepa-200 dark:border-sepa-700 bg-white dark:bg-slate-900 text-sepa-700 dark:text-sepa-200 hover:bg-sepa-50 dark:hover:bg-sepa-900/50 disabled:text-slate-400 dark:disabled:text-slate-500',
  fantasma: 'text-sepa-700 dark:text-sepa-200 hover:bg-sepa-50 dark:hover:bg-sepa-900/50',
  perigo: 'border border-red-200 dark:border-red-800 bg-white dark:bg-slate-900 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/40',
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante
  tamanho?: 'sm' | 'md'
}

export function Button({ variante = 'primario', tamanho = 'md', className, ...rest }: Props) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sepa-500 disabled:cursor-not-allowed',
        tamanho === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-sm',
        estilos[variante],
        className,
      )}
      {...rest}
    />
  )
}
