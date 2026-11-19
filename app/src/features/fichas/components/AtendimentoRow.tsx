import { useState } from 'react'
import { Input } from '../../../components/ui/Field'
import { SelectMenu, type Opcao } from '../../../components/ui/SelectMenu'
import { IconAlertaErro, Icon, IconRemover } from '../../../components/ui/icons'
import { CalendarioSessoes } from './CalendarioSessoes'
import { useProntuarios } from '../../../context/ProntuarioContext'
import { atuanteLogado } from '../../../data/mock'
import { ProntuarioModal } from '../../prontuarios/ProntuarioModal'
import { ESTILO_SESSAO } from '../../prontuarios/estiloSessao'
import { useConfirmar } from '../../../context/ConfirmContext'
import { cn } from '../../../lib/cn'
import { diaMes } from '../../../lib/datas'
import type { LinhaSessao, SituacaoMes, Usuario } from '../../../types'

interface Props {
  linha: LinhaSessao
  usuario?: Usuario
  limites: { min: string; max: string }
  erros: string[]
  onChange: (linha: LinhaSessao) => void
  onRemover: () => void
}

/** Cor só quando a situação foge do normal — o resto da linha fica neutro. */
const OPCOES_SITUACAO: Opcao<SituacaoMes>[] = [
  { valor: 'Segue em atendimento', rotulo: 'Segue em atendimento', tom: 'neutro' },
  { valor: 'Iniciou neste mês', rotulo: 'Iniciou neste mês', descricao: 'Primeiro atendimento do usuário', tom: 'info' },
  { valor: 'Desistiu', rotulo: 'Desistiu', descricao: 'Desistência pelo usuário', tom: 'aviso' },
  { valor: 'Perdeu a vaga por faltas', rotulo: 'Perdeu a vaga por faltas', tom: 'aviso' },
  { valor: 'Alta / encerramento', rotulo: 'Alta / encerramento', descricao: 'Processo encerrado', tom: 'ok' },
  { valor: 'Encaminhado', rotulo: 'Encaminhado', descricao: 'Interno, externo ou lista de espera', tom: 'info' },
]

function iniciais(nome: string) {
  const p = nome.split(' ')
  return (p[0][0] + (p.at(-1)?.[0] ?? '')).toUpperCase()
}

export function AtendimentoRow({ linha, usuario, limites, erros, onChange, onRemover }: Props) {
  const [editandoObs, setEditandoObs] = useState(false)
  const temErro = erros.length > 0
  const confirmar = useConfirmar()
  const nome = usuario?.nome ?? 'este usuário'
  const { daSessao } = useProntuarios()
  /** Data cuja janela de prontuário está aberta. */
  const [prontuarioDia, setProntuarioDia] = useState<string | null>(null)
  const prontuarioAberto = prontuarioDia ? daSessao(atuanteLogado.id, linha.usuarioId, prontuarioDia) : undefined

  async function removerData(i: number) {
    const d = linha.datas[i]
    const ok = await confirmar({
      titulo: 'Excluir data da sessão?',
      mensagem: <>A sessão de <strong>{diaMes(d)}</strong> será retirada do registro de {nome} nesta ficha.</>,
      confirmar: 'Excluir data',
    })
    if (ok) onChange({ ...linha, datas: linha.datas.filter((_, j) => j !== i) })
  }

  async function removerUsuario() {
    const n = linha.datas.length
    const ok = await confirmar({
      titulo: 'Excluir usuário da ficha?',
      mensagem: (
        <>
          <strong>{nome}</strong> ({linha.modalidade}) sai desta ficha
          {n > 0 ? <>, junto com {n === 1 ? 'a sessão registrada' : `as ${n} sessões registradas`}</> : null}. O cadastro do usuário não é apagado.
        </>
      ),
      confirmar: 'Excluir usuário',
    })
    if (ok) onRemover()
  }

  function adicionarData(valor: string) {
    if (!valor || linha.datas.includes(valor)) return
    onChange({ ...linha, datas: [...linha.datas, valor].sort() })
    // a sessão não é só a data: já abre o prontuário dela
    if (linha.usuarioId && !daSessao(atuanteLogado.id, linha.usuarioId, valor)) setProntuarioDia(valor)
  }

  return (
    <li className={cn('group px-4 py-4 sm:px-5', temErro && 'bg-red-50/50 dark:bg-red-950/20')}>
      {/* Celular: usuário, total e excluir no topo; datas e situação embaixo, na largura toda */}
      <div className="grid grid-cols-[minmax(0,1fr)_3.5rem_2rem] items-center gap-x-3 gap-y-3 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_3.5rem_15.5rem_2rem] md:gap-4">
        {/* Usuário */}
        <div className="order-1 flex min-w-0 items-center gap-3 md:order-none">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sepa-50 text-xs font-semibold text-sepa-700 dark:bg-sepa-900/60 dark:text-sepa-200">
            {usuario ? iniciais(usuario.nome) : '?'}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-50">{usuario?.nome ?? 'Usuário não selecionado'}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">CPF {usuario?.cpf ?? '—'}</p>
          </div>
        </div>

        {/* Datas */}
        <div className="order-4 col-span-full flex flex-wrap items-center gap-1.5 md:order-none md:col-span-1">
          {linha.datas.map((d, i) => {
            const fora = d < limites.min || d > limites.max
            const pr = linha.usuarioId ? daSessao(atuanteLogado.id, linha.usuarioId, d) : undefined
            const est = ESTILO_SESSAO[pr?.status ?? 'sem']
            return (
              <span
                key={`${d}-${i}`}
                className={cn(
                  'inline-flex items-center gap-1 rounded-md py-1 pr-1 pl-2 text-xs font-medium tabular-nums',
                  fora
                    ? 'bg-red-100 text-red-800 ring-1 ring-red-300 ring-inset dark:bg-red-400/10 dark:text-red-300 dark:ring-red-400/30'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
                )}
              >
                <button
                  type="button"
                  disabled={!linha.usuarioId}
                  onClick={() => setProntuarioDia(d)}
                  title={`${diaMes(d)}: ${est.texto}. Clique para abrir o prontuário.`}
                  aria-label={`${diaMes(d)}, ${est.texto}. Abrir prontuário`}
                  className="inline-flex items-center gap-1 rounded hover:underline"
                >
                  {!fora && <Icon nome={est.icone} size={14} className={est.cor} />}
                  {diaMes(d)}
                </button>
                <button
                  type="button"
                  aria-label={`Remover ${diaMes(d)}`}
                  onClick={() => removerData(i)}
                  className="flex size-4 items-center justify-center rounded opacity-50 hover:bg-black/10 hover:opacity-100"
                >
                  <Icon nome="close" size={14} />
                </button>
              </span>
            )
          })}
          <CalendarioSessoes
            limites={limites}
            selecionadas={linha.datas}
            onAdicionar={adicionarData}
            onRemover={(d) => removerData(linha.datas.indexOf(d))}
          />
        </div>

        {/* Total (calculado) */}
        <div className="order-2 text-center md:order-none" title="Calculado a partir das datas">
          <p className="text-lg leading-none font-semibold text-slate-900 tabular-nums dark:text-slate-50">{linha.datas.length}</p>
          <p className="mt-0.5 text-[10px] tracking-wide text-slate-400 uppercase dark:text-slate-500">sessões</p>
        </div>

        {/* Situação no mês */}
        <SelectMenu
          ariaLabel="Situação no mês"
          tamanho="sm"
          className="order-5 col-span-full md:order-none md:col-span-1"
          value={linha.situacao}
          onChange={(situacao) => onChange({ ...linha, situacao })}
          opcoes={OPCOES_SITUACAO}
        />

        {/* Remover (aparece no hover) */}
        <button
          type="button"
          onClick={removerUsuario}
          aria-label="Remover usuário da ficha"
          className="order-3 flex size-8 items-center justify-center rounded-lg text-slate-400 transition group-hover:opacity-100 md:order-none md:opacity-0 hover:bg-red-50 hover:text-red-700 focus:opacity-100 dark:hover:bg-red-950/40 dark:hover:text-red-400"
        >
          <IconRemover size={18} />
        </button>
      </div>

      {/* Observação + erros, alinhados sob as datas */}
      <div className="mt-2 space-y-1 md:ml-12">
        {editandoObs || linha.observacao ? (
          <Input
            autoFocus={editandoObs}
            placeholder={linha.situacao === 'Encaminhado' ? 'Para onde foi encaminhado?' : 'Observação (opcional)'}
            value={linha.observacao}
            onChange={(e) => onChange({ ...linha, observacao: e.target.value })}
            onBlur={() => setEditandoObs(false)}
            className="max-w-xl border-transparent! bg-transparent! px-0! py-0.5! text-xs! text-slate-600! focus:ring-0! dark:text-slate-300!"
          />
        ) : (
          <button type="button" onClick={() => setEditandoObs(true)} className="text-xs text-slate-400 hover:text-sepa-700 dark:text-slate-500 dark:hover:text-sepa-200">
            + observação
          </button>
        )}
        {erros.map((e) => (
          <p key={e} className="flex items-center gap-1.5 text-xs font-medium text-red-700 dark:text-red-300">
            <IconAlertaErro size={16} /> {e}
          </p>
        ))}
      </div>
      {prontuarioDia && (
        <ProntuarioModal
          key={prontuarioDia}
          aberto
          sessaoFixa
          onFechar={() => setProntuarioDia(null)}
          prontuario={prontuarioAberto}
          inicial={{ usuarioId: linha.usuarioId, modalidade: linha.modalidade, data: prontuarioDia }}
        />
      )}
    </li>
  )
}
