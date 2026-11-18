import { useState } from 'react'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Field'
import { PageHeader } from '../../components/ui/PageHeader'
import { Badge } from '../../components/ui/StatusBadge'
import { useToast } from '../../context/ToastContext'
import { historicoNadaConsta } from '../../data/mock'
import { cn } from '../../lib/cn'
import { IconDownload, IconBuscar } from '../../components/ui/icons'

/** "Eu queria botar fulaninho e o sistema dizer em que ano esteve, onde, e se deixou pendência." */
export function NadaConstaPage() {
  const toast = useToast()
  const [busca, setBusca] = useState('')
  const [selecionado, setSelecionado] = useState(historicoNadaConsta[0].nome)

  const resultados = historicoNadaConsta.filter((h) => h.nome.toLowerCase().includes(busca.toLowerCase()))
  const aluno = historicoNadaConsta.find((h) => h.nome === selecionado)
  const temPendencia = aluno?.anos.some((a) => a.fichasPendentes > 0 || a.sigSaudePendente)

  return (
    <>
      <PageHeader titulo="Nada Consta" subtitulo="Histórico do discente em todos os anos em que atuou no SEPA." />

      <div className="grid grid-cols-[18rem_1fr] gap-5">
        <Card titulo="Buscar discente">
          <div className="relative">
            <IconBuscar size={18} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <Input placeholder="Nome ou matrícula" value={busca} onChange={(e) => setBusca(e.target.value)} className="pl-9" />
          </div>
          <ul className="mt-3 space-y-1">
            {resultados.map((h) => (
              <li key={h.nome}>
                <button
                  onClick={() => setSelecionado(h.nome)}
                  className={cn('w-full rounded-lg px-3 py-2 text-left text-sm', h.nome === selecionado ? 'bg-sepa-50 dark:bg-sepa-900/50 font-medium text-sepa-800 dark:text-sepa-100' : 'hover:bg-slate-50 dark:hover:bg-slate-800/60')}
                >
                  {h.nome}
                </button>
              </li>
            ))}
          </ul>
        </Card>

        {aluno && (
          <Card
            titulo={aluno.nome}
            descricao={`Matrícula ${aluno.matricula}`}
            acoes={
              <Button disabled={temPendencia} onClick={() => toast(`Nada Consta de ${aluno.nome} emitido (PDF).`)}>
                <IconDownload size={18} /> Emitir Nada Consta
              </Button>
            }
          >
            <div className="mb-4">
              {temPendencia ? (
                <Alert tom="erro" titulo="Há pendências — não é possível emitir">Resolva os itens marcados abaixo.</Alert>
              ) : (
                <Alert tom="ok" titulo="Sem pendências em nenhum ano">O documento pode ser emitido.</Alert>
              )}
            </div>

            <ol className="relative space-y-4 border-l-2 border-sepa-100 dark:border-sepa-800 pl-6">
              {aluno.anos.map((a) => {
                const ok = a.fichasPendentes === 0 && !a.sigSaudePendente
                return (
                  <li key={a.ano} className="relative">
                    <span className={cn('absolute top-1 -left-[1.95rem] size-3.5 rounded-full ring-4 ring-white dark:ring-slate-900', ok ? 'bg-emerald-500' : 'bg-red-500')} />
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-slate-900 dark:text-slate-50">{a.ano}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{a.vinculo}</p>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {a.fichasPendentes ? <Badge tom="erro">{`${a.fichasPendentes} ficha(s) pendente(s)`}</Badge> : <Badge tom="ok">Fichas em dia</Badge>}
                      {a.sigSaudePendente ? <Badge tom="erro">Pendência no SigSaúde</Badge> : <Badge tom="ok">SigSaúde em dia</Badge>}
                    </div>
                    {a.obs && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{a.obs}</p>}
                  </li>
                )
              })}
            </ol>

            <p className="mt-5 border-t border-slate-100 dark:border-slate-800 pt-3 text-sm text-slate-600 dark:text-slate-300">
              Inserido no SIPAC: {aluno.inseridoSIPAC ? <Badge tom="ok">Sim</Badge> : <Badge tom="neutro">Não</Badge>}
            </p>
          </Card>
        )}
      </div>
    </>
  )
}
