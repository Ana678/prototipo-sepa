/**
 * Ícones do projeto — Google Material Symbols (estilo Rounded), via pacote `material-symbols`
 * (fonte servida pelo próprio app, funciona offline).
 * Catálogo: https://fonts.google.com/icons?icon.style=Rounded
 *
 * Use os ícones nomeados abaixo (por significado) ou, para um novo, <Icon nome="..." />.
 * O nome é checado pelo TypeScript.
 */
import type { MaterialSymbol } from 'material-symbols'
import type { CSSProperties } from 'react'
import { cn } from '../../lib/cn'

export interface IconProps {
  size?: number
  /** Versão preenchida do ícone (ex.: item ativo do menu). */
  fill?: boolean
  className?: string
}

export function Icon({ nome, size = 20, fill = false, className }: IconProps & { nome: MaterialSymbol }) {
  const style: CSSProperties = {
    fontSize: size,
    width: size,
    height: size,
    fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${Math.min(Math.max(size, 20), 48)}`,
  }
  return (
    <span className={cn('material-symbols-rounded shrink-0 overflow-hidden select-none', className)} style={style}>
      {nome}
    </span>
  )
}

export type IconeComponente = (props: IconProps) => React.JSX.Element

const criar = (nome: MaterialSymbol): IconeComponente => {
  const Componente = (props: IconProps) => <Icon nome={nome} {...props} />
  Componente.displayName = `Icon(${nome})`
  return Componente
}

/* Navegação */
export const IconFichas = criar('folder_open')
export const IconPreencher = criar('edit_square')
export const IconValidar = criar('fact_check')
export const IconPainel = criar('dashboard')
export const IconUsuarios = criar('group')
export const IconCalendario = criar('calendar_month')
export const IconNadaConsta = criar('task')
export const IconChave = criar('key')
export const IconProntuario = criar('clinical_notes')
export const IconSigilo = criar('lock')
export const IconRelatorios = criar('pie_chart')
export const IconPerfil = criar('person')
export const IconModoClaro = criar('light_mode')
export const IconModoEscuro = criar('dark_mode')

/* Status */
export const IconOk = criar('check_circle')
export const IconAguardando = criar('schedule')
export const IconErro = criar('cancel')
export const IconAviso = criar('warning')
export const IconAlertaErro = criar('error')
export const IconInfo = criar('info')
export const IconNeutro = criar('do_not_disturb_on')

/* Ações */
export const IconAdicionar = criar('add_circle')
export const IconRemover = criar('delete')
export const IconSalvar = criar('save')
export const IconEnviar = criar('send')
export const IconDevolver = criar('undo')
export const IconNotificar = criar('notifications')
export const IconDownload = criar('download')
export const IconBuscar = criar('search')
export const IconSeta = criar('chevron_right')
export const IconExterno = criar('open_in_new')
export const IconAbrir = criar('arrow_forward')
export const IconVoltar = criar('arrow_back')
export const IconHistorico = criar('history')
