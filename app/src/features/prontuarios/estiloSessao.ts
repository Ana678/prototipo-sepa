import type { MaterialSymbol } from 'material-symbols'
import type { StatusProntuario } from '../../types'

/** Como uma data de sessão aparece conforme o prontuário dela (ficha do aluno e ficha que o supervisor confere). */
export const ESTILO_SESSAO: Record<StatusProntuario | 'sem', { icone: MaterialSymbol; cor: string; texto: string }> = {
  sem: { icone: 'note_add', cor: 'text-red-600 dark:text-red-400', texto: 'sem prontuário' },
  rascunho: { icone: 'edit_note', cor: 'text-slate-500 dark:text-slate-400', texto: 'prontuário em rascunho' },
  aguardando_supervisor: { icone: 'schedule', cor: 'text-sepa-600 dark:text-sepa-300', texto: 'prontuário aguardando supervisor' },
  devolvido: { icone: 'undo', cor: 'text-amber-600 dark:text-amber-400', texto: 'prontuário devolvido' },
  validado: { icone: 'check_circle', cor: 'text-emerald-600 dark:text-emerald-400', texto: 'prontuário validado' },
}
