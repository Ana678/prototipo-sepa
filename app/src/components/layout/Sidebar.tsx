import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { NavLink } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { NOMES_PERFIL, usePerfil } from '../../context/PerfilContext'
import { atuanteLogado, fichasParaValidar, painelOutubro, supervisorLogado } from '../../data/mock'
import { cn } from '../../lib/cn'
import { useProntuarios } from '../../context/ProntuarioContext'
import { NOMES_ATUANTES } from '../../data/prontuarios'
import { semEnvio } from '../../features/registro/cruzamentoUsoSala'
import { permissoesDaJanela } from '../../features/permissao/permissoes'
import { ORIENTACAO_RECEPCAO } from '../../features/permissao/regraPermissao'
import type { Perfil } from '../../types'
import {
  IconCalendario,
  IconChave,
  IconFichas,
  IconNadaConsta,
  IconPainel,
  IconPreencher,
  IconProntuario,
  IconRelatorios,
  IconUsuarios,
  IconValidar,
  Icon,
  type IconeComponente,
} from '../ui/icons'

interface ItemMenu {
  para: string
  rotulo: string
  icone: IconeComponente
  /** Contador ao lado do item (ex.: fichas aguardando). */
  contador?: number
}

interface GrupoMenu {
  titulo: string
  itens: ItemMenu[]
}

const naoLiberados = permissoesDaJanela().pessoas.filter((p) => !ORIENTACAO_RECEPCAO[p.situacao].entrega).length

const pendentesDoMes = painelOutubro.filter(semEnvio).length

const MENU: Record<Perfil, GrupoMenu[]> = {
  atuante: [
    {
      titulo: 'Fichas',
      itens: [
        { para: '/fichas', rotulo: 'Minhas fichas', icone: IconFichas },
        { para: '/fichas/nova', rotulo: 'Preencher ficha do mês', icone: IconPreencher },
        { para: '/prontuarios', rotulo: 'Meus prontuários', icone: IconProntuario },
      ],
    },
  ],
  supervisor: [
    {
      titulo: 'Supervisão',
      itens: [
        { para: '/validacao', rotulo: 'Validar fichas', icone: IconValidar, contador: fichasParaValidar.length },
        { para: '/validacao/prontuarios', rotulo: 'Prontuários', icone: IconProntuario },
      ],
    },
  ],
  registro: [
    {
      titulo: 'Acompanhamento',
      itens: [
        { para: '/registro/painel', rotulo: 'Painel do mês', icone: IconPainel, contador: pendentesDoMes },
        { para: '/registro/usuarios', rotulo: 'Usuários e casos', icone: IconUsuarios },
        { para: '/registro/atividades', rotulo: 'Atividades coletivas', icone: IconCalendario },
      ],
    },
    { titulo: 'Documentos', itens: [{ para: '/registro/nada-consta', rotulo: 'Nada Consta', icone: IconNadaConsta }] },
    { titulo: 'Análise', itens: [{ para: '/relatorios', rotulo: 'Relatórios', icone: IconRelatorios }] },
  ],
  recepcao: [{ titulo: 'Recepção', itens: [{ para: '/recepcao', rotulo: 'Liberação de chaves', icone: IconChave, contador: naoLiberados }] }],
  gestao: [{ titulo: 'Análise', itens: [{ para: '/relatorios', rotulo: 'Relatórios', icone: IconRelatorios }] }],
}

/** Quem aparece "logado" no protótipo, por perfil. No sistema real virá do login. */
const USUARIO: Record<Perfil, string> = {
  atuante: atuanteLogado.nome,
  supervisor: supervisorLogado.nome,
  registro: 'Equipe do Registro',
  recepcao: 'Recepção do SEPA',
  gestao: 'Direção do SEPA',
}

function iniciais(nome: string) {
  const partes = nome.replace(/^(Profa?\.)\s*/, '').split(' ')
  return (partes[0][0] + (partes.at(-1)?.[0] ?? '')).toUpperCase()
}

interface Props {
  /** Gaveta do celular (abaixo de lg). */
  aberta: boolean
  onFechar: () => void
}

/** No computador fica fixa à esquerda; no celular vira gaveta aberta pelo botão de menu. */
export function Sidebar({ aberta, onFechar }: Props) {
  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-sepa-600 text-white lg:flex dark:border-r dark:border-white/5 dark:bg-sepa-900">
        <ConteudoMenu />
      </aside>

      <Dialog open={aberta} onClose={onFechar} className="relative z-50 lg:hidden">
        <DialogBackdrop transition className="fixed inset-0 bg-slate-900/50 transition duration-200 data-closed:opacity-0" />
        <DialogPanel
          transition
          className="fixed inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-sepa-600 text-white shadow-xl transition duration-200 ease-out data-closed:-translate-x-full dark:bg-sepa-900"
        >
          <button
            type="button"
            onClick={onFechar}
            aria-label="Fechar menu"
            className="absolute top-3.5 right-3 flex size-9 items-center justify-center rounded-lg text-sepa-100 hover:bg-white/10 hover:text-white"
          >
            <Icon nome="close" size={22} />
          </button>
          <ConteudoMenu onNavegar={onFechar} />
        </DialogPanel>
      </Dialog>
    </>
  )
}

function ConteudoMenu({ onNavegar }: { onNavegar?: () => void }) {
  const { perfil } = usePerfil()
  const nome = USUARIO[perfil]
  const { prontuarios } = useProntuarios()
  // contadores que mudam durante o uso: devolvidos (aluno) e enviados para conferir (supervisor)
  const dinamicos: Record<string, number> = {
    '/prontuarios': prontuarios.filter((p) => p.atuanteId === atuanteLogado.id && p.status === 'devolvido').length,
    '/validacao/prontuarios': prontuarios.filter((p) => p.atuanteId in NOMES_ATUANTES && p.status === 'aguardando_supervisor').length,
  }

  return (
    <>
      {/* Marca */}
      <div className="flex h-16 shrink-0 items-center border-b border-white/10 px-6">
        <img src={logo} alt="SEPA — Serviço de Psicologia Aplicada" className="w-24" />
      </div>

      {/* Navegação */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-6" aria-label="Navegação principal">
        {MENU[perfil].map((grupo) => (
          <div key={grupo.titulo}>
            <p className="mb-2 px-3 text-[11px] font-semibold tracking-[0.12em] text-sepa-200/80 uppercase">{grupo.titulo}</p>
            <ul className="space-y-0.5">
              {grupo.itens.map((item) => (
                <li key={item.para}>
                  <NavLink
                    to={item.para}
                    end
                    onClick={onNavegar}
                    className={({ isActive }) =>
                      cn(
                        'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors lg:py-2',
                        isActive
                          ? 'bg-white/15 font-semibold text-white'
                          : 'font-medium text-sepa-100 hover:bg-white/8 hover:text-white',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {/* indicador do item ativo */}
                        <span
                          aria-hidden
                          className={cn('absolute top-1.5 bottom-1.5 -left-3 w-1 rounded-r-full bg-white transition-opacity', isActive ? 'opacity-100' : 'opacity-0')}
                        />
                        <item.icone size={20} fill={isActive} className={isActive ? 'text-white' : 'text-sepa-200'} />
                        <span className="flex-1 truncate">{item.rotulo}</span>
                        {!!(dinamicos[item.para] ?? item.contador) && (
                          <span
                            className={cn(
                              'min-w-5 rounded-full px-1.5 py-0.5 text-center text-[11px] leading-none font-semibold tabular-nums',
                              isActive ? 'bg-white text-sepa-700' : 'bg-white/15 text-white',
                            )}
                            aria-label={`${dinamicos[item.para] ?? item.contador} pendentes`}
                          >
                            {dinamicos[item.para] ?? item.contador}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Quem está usando */}
      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs font-semibold text-white ring-1 ring-white/20">
            {iniciais(nome)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{nome}</p>
            <p className="truncate text-xs text-sepa-200">{NOMES_PERFIL[perfil]}</p>
          </div>
        </div>
        <p className="mt-2 px-3 text-[11px] text-sepa-200/70">Fichas e Relatórios · protótipo v0.1</p>
      </div>
    </>
  )
}
