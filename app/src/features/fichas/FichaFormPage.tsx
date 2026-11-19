import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StatusFichaBadge } from '../../components/ui/StatusBadge'
import { IconAguardando } from '../../components/ui/icons'
import { useProntuarios } from '../../context/ProntuarioContext'
import { useToast } from '../../context/ToastContext'
import { atuanteLogado, meusUsuariosIds, rascunhoNovembro, usuarios } from '../../data/mock'
import { dataBR, limitesDoMes, nomeReferencia, prazoEnvio } from '../../lib/datas'
import type { FichaMensal } from '../../types'
import { AtendimentosCard } from './components/AtendimentosCard'
import { RodapeEnvio } from './components/RodapeEnvio'
import { validarFicha } from './validarFicha'

export function FichaFormPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [ficha, setFicha] = useState<FichaMensal>(rascunhoNovembro)
  const [semAtendimentos, setSemAtendimentos] = useState(false)
  const [justificativa, setJustificativa] = useState('')

  const meusUsuarios = usuarios.filter((u) => meusUsuariosIds.includes(u.id))
  const { daSessao } = useProntuarios()
  const erros = useMemo(
    () => validarFicha(ficha, semAtendimentos, justificativa, (u, d) => daSessao(atuanteLogado.id, u, d)),
    [ficha, semAtendimentos, justificativa, daSessao],
  )
  const atuante = atuanteLogado

  return (
    <>
      {/* Cabeçalho: a identificação (antes um cartão inteiro) vira uma linha — vem do cadastro */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-sepa-700 dark:text-sepa-200">Ficha de Acompanhamento Mensal</p>
          <h1 className="mt-0.5 text-2xl font-semibold tracking-tight text-slate-900 first-letter:uppercase dark:text-slate-50">
            {nomeReferencia(ficha.referencia)}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {atuante.nome} · {atuante.vinculo} · Supervisão: {atuante.supervisor}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
            <IconAguardando size={18} /> Envio até <strong className="font-semibold">{dataBR(prazoEnvio(ficha.referencia))}</strong>
          </span>
          <StatusFichaBadge status="rascunho" />
        </div>
      </div>

      <AtendimentosCard
        sessoes={ficha.sessoes}
        usuarios={meusUsuarios}
        limites={limitesDoMes(ficha.referencia)}
        erros={erros}
        semAtendimentos={semAtendimentos}
        justificativa={justificativa}
        onSemAtendimentos={setSemAtendimentos}
        onJustificativa={setJustificativa}
        onChange={(sessoes) => setFicha((f) => ({ ...f, sessoes }))}
      />

      <div className="sticky bottom-0 -mx-4 mt-6 border-t border-slate-200 bg-white/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-12 lg:px-12 xl:-mx-16 xl:px-16 dark:border-slate-800 dark:bg-slate-950/90">
        <RodapeEnvio
          erros={erros}
          supervisor={atuante.supervisor}
          onSalvar={() => toast('Rascunho salvo.')}
          onEnviar={() => {
            toast(`Ficha de ${nomeReferencia(ficha.referencia)} enviada para ${atuante.supervisor}.`)
            navigate('/fichas')
          }}
        />
      </div>
    </>
  )
}
