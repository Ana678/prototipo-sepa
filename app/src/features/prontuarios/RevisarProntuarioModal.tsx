import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Label, Textarea } from '../../components/ui/Field'
import { IconDevolver, IconOk } from '../../components/ui/icons'
import { Modal } from '../../components/ui/Modal'
import { StatusProntuarioBadge } from '../../components/ui/StatusBadge'
import { useProntuarios } from '../../context/ProntuarioContext'
import { useToast } from '../../context/ToastContext'
import { supervisorLogado, usuarios } from '../../data/mock'
import { NOMES_ATUANTES } from '../../data/prontuarios'
import { dataBR } from '../../lib/datas'
import type { Prontuario } from '../../types'
import { AvisoSigilo, HistoricoProntuario } from './HistoricoProntuario'

interface Props {
  prontuario: Prontuario
  onFechar: () => void
}

/** Supervisor lê o prontuário e valida ou devolve com comentário (o comentário é obrigatório na devolução). */
export function RevisarProntuarioModal({ prontuario: p, onFechar }: Props) {
  const { validar, devolver } = useProntuarios()
  const toast = useToast()
  const [comentario, setComentario] = useState('')
  const [tentouDevolver, setTentouDevolver] = useState(false)
  const pendente = p.status === 'aguardando_supervisor'
  const aluno = NOMES_ATUANTES[p.atuanteId] ?? 'Aluno'
  const usuario = usuarios.find((u) => u.id === p.usuarioId)?.nome

  return (
    <Modal
      aberto
      onFechar={onFechar}
      tamanho="lg"
      titulo={`Prontuário · ${usuario}`}
      descricao={`${aluno} · sessão de ${dataBR(p.data)} · ${p.modalidade}`}
      acoes={
        pendente ? (
          <>
            <Button
              variante="perigo"
              onClick={() => {
                setTentouDevolver(true)
                if (!comentario.trim()) return
                devolver(p.id, supervisorLogado.nome, comentario.trim())
                toast(`Prontuário devolvido a ${aluno} com seu comentário.`)
                onFechar()
              }}
            >
              <IconDevolver size={18} /> Devolver com comentário
            </Button>
            <Button
              onClick={() => {
                validar(p.id, supervisorLogado.nome, comentario)
                toast(`Prontuário de ${dataBR(p.data)} validado.`)
                onFechar()
              }}
            >
              <IconOk size={18} /> Validar
            </Button>
          </>
        ) : (
          <Button variante="secundario" onClick={onFechar}>Fechar</Button>
        )
      }
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <StatusProntuarioBadge status={p.status} />
          <AvisoSigilo />
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap text-slate-800 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100">
          {p.texto}
        </div>

        {pendente && (
          <div>
            <Label htmlFor="comentario-sup">Comentário para {aluno.split(' ')[0]}</Label>
            <Textarea
              id="comentario-sup"
              rows={3}
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Obrigatório para devolver: o que precisa ser corrigido. Opcional ao validar."
            />
            {tentouDevolver && !comentario.trim() && (
              <p className="mt-1 text-xs font-medium text-red-700 dark:text-red-300">Para devolver, diga o que precisa ser corrigido.</p>
            )}
          </div>
        )}

        <section>
          <h3 className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">Andamento</h3>
          <HistoricoProntuario eventos={p.eventos} />
        </section>
      </div>
    </Modal>
  )
}
