import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Description } from '@headlessui/react'
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import { Button } from '../components/ui/Button'
import { IconRemover } from '../components/ui/icons'

export interface OpcoesConfirmacao {
  titulo: string
  mensagem: ReactNode
  /** Texto do botão de confirmação. Padrão: "Excluir". */
  confirmar?: string
}

type Confirmar = (opcoes: OpcoesConfirmacao) => Promise<boolean>

const ConfirmContext = createContext<Confirmar | null>(null)

/**
 * Confirmação de exclusão padrão do sistema.
 * Uso: `if (await confirmar({ titulo, mensagem })) excluir()`
 */
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [opcoes, setOpcoes] = useState<OpcoesConfirmacao | null>(null)
  const resolver = useRef<(v: boolean) => void>(undefined)
  const cancelarRef = useRef<HTMLButtonElement>(null)

  const confirmar = useCallback<Confirmar>((o) => {
    setOpcoes(o)
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve
    })
  }, [])

  function fechar(resultado: boolean) {
    resolver.current?.(resultado)
    resolver.current = undefined
    setOpcoes(null)
  }

  return (
    <ConfirmContext.Provider value={confirmar}>
      {children}
      <Dialog open={opcoes !== null} onClose={() => fechar(false)} initialFocus={cancelarRef} className="relative z-50">
        <DialogBackdrop transition className="fixed inset-0 bg-slate-900/40 transition duration-150 data-closed:opacity-0 dark:bg-black/60" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl transition duration-150 data-closed:scale-95 data-closed:opacity-0 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400">
                <IconRemover size={22} />
              </span>
              <div className="min-w-0">
                <DialogTitle className="text-base font-semibold text-slate-900 dark:text-slate-50">{opcoes?.titulo}</DialogTitle>
                <Description as="div" className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {opcoes?.mensagem}
                </Description>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button ref={cancelarRef} variante="secundario" onClick={() => fechar(false)}>
                Cancelar
              </Button>
              <Button variante="excluir" onClick={() => fechar(true)}>
                {opcoes?.confirmar ?? 'Excluir'}
              </Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </ConfirmContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useConfirmar() {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error('useConfirmar precisa estar dentro de <ConfirmProvider>')
  return ctx
}
