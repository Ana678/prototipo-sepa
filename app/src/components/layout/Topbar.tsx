import { useNavigate } from 'react-router-dom'
import { HOME_PERFIL, NOMES_PERFIL, usePerfil } from '../../context/PerfilContext'
import { useTema } from '../../context/ThemeContext'
import type { Perfil } from '../../types'
import { Icon, IconChave, IconModoClaro, IconModoEscuro, IconPainel, IconPerfil, IconPreencher, IconRelatorios, IconValidar } from '../ui/icons'
import { SelectMenu } from '../ui/SelectMenu'

/** No protótipo, o perfil é trocado aqui. No sistema real ele virá do login (SIGAA / UFRN). */
export function Topbar({ onAbrirMenu }: { onAbrirMenu: () => void }) {
  const { perfil, setPerfil } = usePerfil()
  const navigate = useNavigate()
  const { tema, alternar } = useTema()

  function trocar(p: Perfil) {
    setPerfil(p)
    navigate(HOME_PERFIL[p])
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 sm:px-6 lg:static lg:px-12 xl:px-16 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onAbrirMenu}
          aria-label="Abrir menu"
          className="-ml-2 flex size-10 shrink-0 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Icon nome="menu" size={24} />
        </button>
        <p className="hidden truncate text-sm text-slate-500 md:block dark:text-slate-400">Fichas de Atendimento e Relatórios</p>
      </div>
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <span className="hidden rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800 ring-1 ring-amber-200 xl:inline dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/20">
          Protótipo · dados fictícios
        </span>
        <span className="hidden items-center gap-1.5 text-sm text-slate-600 sm:inline-flex dark:text-slate-300">
          <IconPerfil size={18} /> Ver como
        </span>
        <SelectMenu
          ariaLabel="Ver o sistema como"
          tamanho="sm"
          className="w-56 min-w-0 sm:w-80"
          value={perfil}
          onChange={trocar}
          opcoes={[
            { valor: 'atuante', rotulo: NOMES_PERFIL.atuante, icone: IconPreencher },
            { valor: 'supervisor', rotulo: NOMES_PERFIL.supervisor, icone: IconValidar },
            { valor: 'registro', rotulo: NOMES_PERFIL.registro, icone: IconPainel },
            { valor: 'recepcao', rotulo: NOMES_PERFIL.recepcao, icone: IconChave },
            { valor: 'gestao', rotulo: NOMES_PERFIL.gestao, icone: IconRelatorios },
          ]}
        />
        <button
          type="button"
          onClick={alternar}
          aria-label={tema === 'escuro' ? 'Ativar modo claro' : 'Ativar modo escuro'}
          title={tema === 'escuro' ? 'Modo claro' : 'Modo escuro'}
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-sepa-700 focus-visible:outline-2 focus-visible:outline-sepa-500 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-sepa-200"
        >
          {tema === 'escuro' ? <IconModoClaro size={22} /> : <IconModoEscuro size={22} />}
        </button>
      </div>
    </header>
  )
}
