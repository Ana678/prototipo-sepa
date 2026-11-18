import { useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader'
import { useToast } from '../../context/ToastContext'
import { fichasParaValidar, supervisorLogado } from '../../data/mock'
import { cn } from '../../lib/cn'
import { dataBR, nomeReferencia } from '../../lib/datas'
import { FichaDetalhe } from './FichaDetalhe'

export function ValidacaoPage() {
  const toast = useToast()
  const [fila, setFila] = useState(fichasParaValidar)
  const [selecionada, setSelecionada] = useState(fila[0]?.id)
  const ficha = fila.find((f) => f.id === selecionada)

  function concluir(id: string, msg: string) {
    const resto = fila.filter((f) => f.id !== id)
    setFila(resto)
    setSelecionada(resto[0]?.id)
    toast(msg)
  }

  return (
    <>
      <PageHeader titulo="Validar fichas" subtitulo={`${supervisorLogado.nome} · ${fila.length} ficha(s) aguardando sua conferência`} />

      <div className="grid min-h-[32rem] grid-cols-[20rem_1fr] gap-5">
        <ul className="space-y-2" aria-label="Fichas aguardando">
          {fila.map((f) => (
            <li key={f.id}>
              <button
                onClick={() => setSelecionada(f.id)}
                className={cn(
                  'w-full rounded-xl border px-4 py-3 text-left transition-colors',
                  f.id === selecionada ? 'border-sepa-500 bg-sepa-50 dark:bg-sepa-900/50 ring-1 ring-sepa-500' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-sepa-300 dark:hover:border-sepa-500',
                )}
              >
                <p className="font-medium text-slate-900 dark:text-slate-50">{f.atuante.nome}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 first-letter:uppercase">
                  {nomeReferencia(f.referencia)} · {f.atuante.vinculo} · enviada {dataBR(f.enviadaEm)}
                </p>
              </button>
            </li>
          ))}
          {fila.length === 0 && <li className="rounded-xl border border-dashed border-slate-300 dark:border-slate-600 p-6 text-center text-sm text-slate-500 dark:text-slate-400">Nenhuma ficha pendente.</li>}
        </ul>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          {ficha ? (
            <FichaDetalhe
              key={ficha.id}
              ficha={ficha}
              onValidar={() => concluir(ficha.id, `Ficha de ${ficha.atuante.nome} validada. O Registro foi notificado.`)}
              onDevolver={(_, naoBloquear) =>
                concluir(ficha.id, `Ficha devolvida a ${ficha.atuante.nome}${naoBloquear ? ' (salas continuam liberadas)' : ''}.`)
              }
            />
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">Selecione uma ficha.</p>
          )}
        </div>
      </div>
    </>
  )
}
