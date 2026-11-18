import { NavLink } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { usePerfil } from '../../context/PerfilContext'
import { cn } from '../../lib/cn'
import type { Perfil } from '../../types'
import {
  IconCalendario,
  IconValidar,
  IconNadaConsta,
  IconFichas,
  IconPreencher,
  IconRelatorios,
  IconUsuarios,
  IconPainel,
  type IconeComponente,
} from '../ui/icons'

interface ItemMenu {
  para: string
  rotulo: string
  icone: IconeComponente
}

const MENU: Record<Perfil, ItemMenu[]> = {
  atuante: [
    { para: '/fichas', rotulo: 'Minhas fichas', icone: IconFichas },
    { para: '/fichas/nova', rotulo: 'Preencher ficha do mês', icone: IconPreencher },
  ],
  supervisor: [{ para: '/validacao', rotulo: 'Validar fichas', icone: IconValidar }],
  registro: [
    { para: '/registro/painel', rotulo: 'Painel do mês', icone: IconPainel },
    { para: '/registro/usuarios', rotulo: 'Usuários e casos', icone: IconUsuarios },
    { para: '/registro/atividades', rotulo: 'Atividades coletivas', icone: IconCalendario },
    { para: '/registro/nada-consta', rotulo: 'Nada Consta', icone: IconNadaConsta },
    { para: '/relatorios', rotulo: 'Relatórios', icone: IconRelatorios },
  ],
  gestao: [{ para: '/relatorios', rotulo: 'Relatórios', icone: IconRelatorios }],
}

export function Sidebar() {
  const { perfil } = usePerfil()

  return (
    <aside className="flex w-64 shrink-0 flex-col bg-sepa-600 text-white dark:border-r dark:border-sepa-800 dark:bg-sepa-900">
      <div className="px-6 pt-6 pb-5">
        <img src={logo} alt="SEPA — Serviço de Psicologia Aplicada" className="w-28" />
      </div>

      <nav className="flex-1 px-3" aria-label="Navegação principal">
        <ul className="space-y-1">
          {MENU[perfil].map((item) => (
            <li key={item.para}>
              <NavLink
                to={item.para}
                end
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive ? 'bg-white text-sepa-700 shadow-sm dark:bg-sepa-600 dark:text-white' : 'text-sepa-50 hover:bg-sepa-700 dark:hover:bg-sepa-800',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icone size={22} fill={isActive} />
                    {item.rotulo}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <p className="px-6 py-5 text-xs text-sepa-200">Módulo de Fichas e Relatórios · protótipo v0.1</p>
    </aside>
  )
}
