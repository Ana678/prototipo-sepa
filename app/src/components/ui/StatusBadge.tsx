import type { SituacaoSala, StatusFicha } from '../../types'
import { cn } from '../../lib/cn'
import { IconOk, IconAguardando, IconErro, IconAviso, IconNeutro, type IconeComponente } from './icons'

type Tom = 'ok' | 'aviso' | 'erro' | 'neutro' | 'info'

const tons: Record<Tom, string> = {
  ok: 'bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/20',
  aviso: 'bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/20',
  erro: 'bg-red-50 text-red-800 ring-red-200 dark:bg-red-400/10 dark:text-red-300 dark:ring-red-400/20',
  neutro: 'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-400/10 dark:text-slate-300 dark:ring-slate-400/20',
  info: 'bg-sepa-50 text-sepa-800 ring-sepa-200 dark:bg-sepa-400/20 dark:text-sepa-200 dark:ring-sepa-300/30',
}

/** Ícone + texto: status nunca é comunicado só pela cor. */
const icones: Record<Tom, IconeComponente> = {
  ok: IconOk,
  aviso: IconAviso,
  erro: IconErro,
  neutro: IconNeutro,
  info: IconAguardando,
}

export function Badge({ tom, children }: { tom: Tom; children: string }) {
  const Icone = icones[tom]
  return (
    <span className={cn('inline-flex items-center gap-1 whitespace-nowrap rounded-full py-0.5 pr-2.5 pl-2 text-xs font-medium ring-1 ring-inset', tons[tom])}>
      <Icone size={14} className="shrink-0" />
      {children}
    </span>
  )
}

const FICHA: Record<StatusFicha | 'nao_enviada', { tom: Tom; texto: string }> = {
  rascunho: { tom: 'neutro', texto: 'Rascunho' },
  aguardando_supervisor: { tom: 'info', texto: 'Aguardando supervisor' },
  validada: { tom: 'ok', texto: 'Validada' },
  devolvida: { tom: 'aviso', texto: 'Devolvida p/ correção' },
  atrasada: { tom: 'erro', texto: 'Atrasada' },
  nao_enviada: { tom: 'erro', texto: 'Não enviada' },
}

export function StatusFichaBadge({ status }: { status: StatusFicha | 'nao_enviada' }) {
  const s = FICHA[status]
  return <Badge tom={s.tom}>{s.texto}</Badge>
}

const SALA: Record<SituacaoSala, { tom: Tom; texto: string }> = {
  liberado: { tom: 'ok', texto: 'Liberado' },
  bloqueado: { tom: 'erro', texto: 'Bloqueado' },
  excecao: { tom: 'aviso', texto: 'Liberado (exceção)' },
  aguardando: { tom: 'info', texto: 'Aguardando validação' },
}

export function SituacaoSalaBadge({ situacao }: { situacao: SituacaoSala }) {
  const s = SALA[situacao]
  return <Badge tom={s.tom}>{s.texto}</Badge>
}
