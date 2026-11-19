import { useState } from 'react'
import { Input } from '../../../components/ui/Field'
import { SelectMenu, type Opcao } from '../../../components/ui/SelectMenu'
import { IconAdicionar, IconAlertaErro, Icon, IconRemover } from '../../../components/ui/icons'
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
  const [adicionandoData, setAdicionandoData] = useState(false)
  const [editandoObs, setEditandoObs] = useState(false)
  const temErro = erros.length > 0
  const confirmar = useConfirmar()
  const nome = usuario?.nome ?? 'este usuário'

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
    if (!valor) return
    onChange({ ...linha, datas: [...linha.datas, valor].sort() })
    setAdicionandoData(false)
  }

  return (
    <li className={cn('group px-5 py-4', temErro && 'bg-red-50/50 dark:bg-red-950/20')}>
      <div className="grid grid-cols-[minmax(0,15rem)_minmax(0,1fr)_3.5rem_15.5rem_2rem] items-center gap-4">
        {/* Usuário */}
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sepa-50 text-xs font-semibold text-sepa-700 dark:bg-sepa-900/60 dark:text-sepa-200">
            {usuario ? iniciais(usuario.nome) : '?'}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-50">{usuario?.nome ?? 'Usuário não selecionado'}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">CPF {usuario?.cpf ?? '—'}</p>
          </div>
        </div>

        {/* Datas */}
        <div className="flex flex-wrap items-center gap-1.5">
          {linha.datas.map((d, i) => {
            const fora = d < limites.min || d > limites.max
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
                {diaMes(d)}
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
          {adicionandoData ? (
            <Input
              type="date"
              autoFocus
              aria-label="Data da sessão"
              min={limites.min}
              max={limites.max}
              onChange={(e) => adicionarData(e.target.value)}
              onBlur={() => setAdicionandoData(false)}
              className="w-36 py-0.5! text-xs!"
            />
          ) : (
            <button
              type="button"
              onClick={() => setAdicionandoData(true)}
              className="inline-flex items-center gap-1 rounded-md border border-dashed border-slate-300 px-2 py-1 text-xs font-medium text-slate-500 hover:border-sepa-400 hover:text-sepa-700 dark:border-slate-600 dark:text-slate-400 dark:hover:text-sepa-200"
            >
              <IconAdicionar size={14} /> data
            </button>
          )}
        </div>

        {/* Total (calculado) */}
        <div className="text-center" title="Calculado a partir das datas">
          <p className="text-lg leading-none font-semibold text-slate-900 tabular-nums dark:text-slate-50">{linha.datas.length}</p>
          <p className="mt-0.5 text-[10px] tracking-wide text-slate-400 uppercase dark:text-slate-500">sessões</p>
        </div>

        {/* Situação no mês */}
        <SelectMenu
          ariaLabel="Situação no mês"
          tamanho="sm"
          value={linha.situacao}
          onChange={(situacao) => onChange({ ...linha, situacao })}
          opcoes={OPCOES_SITUACAO}
        />

        {/* Remover (aparece no hover) */}
        <button
          type="button"
          onClick={removerUsuario}
          aria-label="Remover usuário da ficha"
          className="flex size-8 items-center justify-center rounded-lg text-slate-400 opacity-0 transition group-hover:opacity-100 hover:bg-red-50 hover:text-red-700 focus:opacity-100 dark:hover:bg-red-950/40 dark:hover:text-red-400"
        >
          <IconRemover size={18} />
        </button>
      </div>

      {/* Observação + erros, alinhados sob as datas */}
      <div className="mt-2 ml-12 space-y-1">
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
    </li>
  )
}
