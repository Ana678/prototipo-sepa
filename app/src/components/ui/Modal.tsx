import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Icon } from './icons'

interface Props {
  aberto: boolean
  onFechar: () => void
  titulo: string
  descricao?: ReactNode
  children: ReactNode
  /** Botões do rodapé. */
  acoes?: ReactNode
  tamanho?: 'md' | 'lg'
}

/** Modal padrão do sistema (Headless UI): foco preso dentro, Esc e clique fora fecham. */
export function Modal({ aberto, onFechar, titulo, descricao, children, acoes, tamanho = 'md' }: Props) {
  return (
    <Dialog open={aberto} onClose={onFechar} className="relative z-50">
      <DialogBackdrop transition className="fixed inset-0 bg-slate-900/40 transition duration-150 data-closed:opacity-0 dark:bg-black/60" />
      <div className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4">
        <DialogPanel
          transition
          className={cn(
            'w-full rounded-2xl border border-slate-200 bg-white shadow-xl transition duration-150 data-closed:scale-95 data-closed:opacity-0 dark:border-slate-800 dark:bg-slate-900',
            tamanho === 'lg' ? 'max-w-2xl' : 'max-w-lg',
          )}
        >
          <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-4 py-4 sm:px-6 dark:border-slate-800">
            <div>
              <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50">{titulo}</DialogTitle>
              {descricao && <Description className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{descricao}</Description>}
            </div>
            <button
              type="button"
              onClick={onFechar}
              aria-label="Fechar"
              className="-mr-2 flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <Icon nome="close" size={20} />
            </button>
          </header>
          <div className="px-4 py-5 sm:px-6">{children}</div>
          {acoes && <footer className="flex flex-wrap justify-end gap-2 border-t border-slate-100 px-4 py-4 sm:px-6 dark:border-slate-800">{acoes}</footer>}
        </DialogPanel>
      </div>
    </Dialog>
  )
}
