import { MODALIDADES, type LinhaSessao, type Modalidade, type Usuario } from '../../../types'
import { Textarea } from '../../../components/ui/Field'
import type { ErroFicha } from '../validarFicha'
import { AdicionarUsuario } from './AdicionarUsuario'
import { AtendimentoRow } from './AtendimentoRow'

interface Props {
  sessoes: LinhaSessao[]
  usuarios: Usuario[]
  limites: { min: string; max: string }
  erros: ErroFicha[]
  semAtendimentos: boolean
  justificativa: string
  onSemAtendimentos: (v: boolean) => void
  onJustificativa: (v: string) => void
  onChange: (sessoes: LinhaSessao[]) => void
}

export function AtendimentosCard(props: Props) {
  const { sessoes, usuarios, limites, erros, semAtendimentos, onChange } = props
  const grupos = MODALIDADES.filter((m) => sessoes.some((s) => s.modalidade === m))
  const total = sessoes.reduce((s, l) => s + l.datas.length, 0)

  function adicionar(modalidade: Modalidade, usuarioId: string) {
    onChange([...sessoes, { id: crypto.randomUUID(), modalidade, usuarioId, datas: [], situacao: 'Segue em atendimento', observacao: '' }])
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-4 sm:px-5">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">Atendimentos do mês</h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Um usuário por linha: datas das sessões e como ele está neste mês.</p>
        </div>
        {!semAtendimentos && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            <strong className="text-slate-900 tabular-nums dark:text-slate-50">{sessoes.length}</strong> usuários ·{' '}
            <strong className="text-slate-900 tabular-nums dark:text-slate-50">{total}</strong> sessões
          </p>
        )}
      </header>

      {semAtendimentos ? (
        <div className="border-t border-slate-100 px-5 py-4 dark:border-slate-800">
          <Textarea rows={3} placeholder="Por que não houve atendimentos? (ex.: férias, usuários em viagem)" value={props.justificativa} onChange={(e) => props.onJustificativa(e.target.value)} />
        </div>
      ) : (
        grupos.map((mod) => {
          const linhas = sessoes.filter((s) => s.modalidade === mod)
          return (
            <div key={mod} className="border-t border-slate-100 dark:border-slate-800">
              <p className="bg-slate-50 px-5 py-2 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:bg-slate-800/40 dark:text-slate-400">
                {mod} <span className="font-normal">· {linhas.length}</span>
              </p>
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {linhas.map((linha) => (
                  <AtendimentoRow
                    key={linha.id}
                    linha={linha}
                    usuario={usuarios.find((u) => u.id === linha.usuarioId)}
                    limites={limites}
                    erros={erros.filter((e) => e.alvo === linha.id).map((e) => e.mensagem)}
                    onChange={(nova) => onChange(sessoes.map((s) => (s.id === nova.id ? nova : s)))}
                    onRemover={() => onChange(sessoes.filter((s) => s.id !== linha.id))}
                  />
                ))}
              </ul>
            </div>
          )
        })
      )}

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 dark:border-slate-800">
        {!semAtendimentos ? <AdicionarUsuario usuarios={usuarios} existentes={sessoes} onAdicionar={adicionar} /> : <span />}
        <label className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <input type="checkbox" checked={semAtendimentos} onChange={(e) => props.onSemAtendimentos(e.target.checked)} className="size-4 accent-sepa-600" />
          Não houve atendimentos neste mês
        </label>
      </footer>
    </section>
  )
}
