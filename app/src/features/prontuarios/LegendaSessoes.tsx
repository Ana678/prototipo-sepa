import { Icon } from '../../components/ui/icons'
import { ESTILO_SESSAO } from './estiloSessao'

/** Legenda dos ícones nas datas das sessões. */
export function LegendaSessoes() {
  return (
    <p className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
      {(['validado', 'aguardando_supervisor', 'devolvido', 'rascunho', 'sem'] as const).map((s) => (
        <span key={s} className="inline-flex items-center gap-1">
          <Icon nome={ESTILO_SESSAO[s].icone} size={14} className={ESTILO_SESSAO[s].cor} />
          {ESTILO_SESSAO[s].texto.replace('prontuário ', '').replace(/^./, (c) => c.toUpperCase())}
        </span>
      ))}
    </p>
  )
}
