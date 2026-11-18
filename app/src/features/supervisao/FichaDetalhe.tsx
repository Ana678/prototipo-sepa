import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Label, Textarea } from '../../components/ui/Field'
import type { FichaParaValidar } from '../../data/mock'
import { dataBR, nomeReferencia } from '../../lib/datas'
import { IconOk, IconDevolver } from '../../components/ui/icons'

interface Props {
  ficha: FichaParaValidar
  onValidar: () => void
  onDevolver: (motivo: string, naoBloquear: boolean) => void
}

/** Substitui o e-mail "zero pendências": o supervisor confere com o SigSaúde e decide aqui. */
export function FichaDetalhe({ ficha, onValidar, onDevolver }: Props) {
  const [modo, setModo] = useState<'ver' | 'devolver'>('ver')
  const [motivo, setMotivo] = useState('')
  const [naoBloquear, setNaoBloquear] = useState(false)
  const total = ficha.linhas.reduce((s, l) => s + l.datas.length, 0)

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{ficha.atuante.nome}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 first-letter:uppercase">
          {nomeReferencia(ficha.referencia)} · {ficha.atuante.vinculo} · enviada em {dataBR(ficha.enviadaEm)}
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto py-4">
        <div>
          <h3 className="mb-1 text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400 uppercase">Movimentações</h3>
          {ficha.movimentacoes.length ? (
            <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-200">
              {ficha.movimentacoes.map((m) => <li key={m}>{m}</li>)}
            </ul>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">Nenhuma.</p>
          )}
        </div>

        <div>
          <h3 className="mb-2 text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400 uppercase">Sessões ({total})</h3>
          <table className="w-full text-sm">
            <tbody>
              {ficha.linhas.map((l) => (
                <tr key={l.usuario} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <td className="py-2 pr-2">
                    <p className="font-medium text-slate-800 dark:text-slate-100">{l.usuario}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{l.modalidade}</p>
                  </td>
                  <td className="py-2 text-slate-600 dark:text-slate-300 tabular-nums">{l.datas.join(', ')}</td>
                  <td className="py-2 text-right font-semibold tabular-nums">{l.datas.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Confira estas datas com os prontuários do SigSaúde antes de validar.</p>
        </div>

        {modo === 'devolver' && (
          <div className="space-y-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50 p-4">
            <div>
              <Label htmlFor="motivo">O que precisa ser corrigido?</Label>
              <Textarea id="motivo" rows={3} value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Ex.: sessão de 16/10 não consta no SigSaúde." />
            </div>
            <label className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
              <input type="checkbox" checked={naoBloquear} onChange={(e) => setNaoBloquear(e.target.checked)} className="mt-0.5 size-4 accent-sepa-600" />
              <span>
                <strong>Não bloquear o uso de salas</strong> — a correção já foi combinada com o(a) estagiário(a).
              </span>
            </label>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4">
        {modo === 'ver' ? (
          <>
            <Button variante="perigo" onClick={() => setModo('devolver')}><IconDevolver size={18} /> Devolver com pendência</Button>
            <Button onClick={onValidar}><IconOk size={18} /> Validar — sem pendências</Button>
          </>
        ) : (
          <>
            <Button variante="fantasma" onClick={() => setModo('ver')}>Cancelar</Button>
            <Button disabled={!motivo.trim()} onClick={() => onDevolver(motivo, naoBloquear)}>Enviar devolução</Button>
          </>
        )}
      </div>
    </div>
  )
}
