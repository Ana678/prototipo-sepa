import { useState, type ReactNode } from 'react'
import { Icon } from '../../components/ui/icons'
import { PageHeader } from '../../components/ui/PageHeader'
import { useToast } from '../../context/ToastContext'
import { fichasParaValidar, painelOutubro, supervisorLogado } from '../../data/mock'
import { cn } from '../../lib/cn'
import { dataBR, nomeReferencia } from '../../lib/datas'
import { permissoesDaJanela } from '../permissao/permissoes'
import { declaracaoDe, semEnvio } from '../registro/cruzamentoUsoSala'
import { FichaDetalhe } from './FichaDetalhe'
import { FichaNaoEnviada } from './FichaNaoEnviada'

/** Alunos deste supervisor que passaram do prazo sem enviar a ficha. */
const naoEnviadas = painelOutubro.filter((l) => l.atuante.supervisor === supervisorLogado.nome && semEnvio(l))

const situacaoSala = new Map(permissoesDaJanela().pessoas.map((p) => [p.atuanteId, p.situacao]))

type Alerta = 'bloqueado' | 'pendencia' | null

/** Vermelho = bloqueado para salas. Amarelo = qualquer pendência que ainda não bloqueou. */
function alertaDe(atuanteId: string): Alerta {
  if (situacaoSala.get(atuanteId) === 'bloqueado') return 'bloqueado'
  const temPendencia =
    declaracaoDe(atuanteId).pendencias.length > 0 ||
    painelOutubro.some((l) => l.atuante.id === atuanteId && (semEnvio(l) || l.status === 'devolvida'))
  return temPendencia ? 'pendencia' : null
}

function Bolinha({ alerta }: { alerta: Alerta }) {
  if (!alerta) return null
  const rotulo = alerta === 'bloqueado' ? 'Bloqueado para salas' : 'Tem pendência'
  return (
    <span
      title={rotulo}
      aria-label={rotulo}
      className={cn('size-2.5 shrink-0 rounded-full', alerta === 'bloqueado' ? 'bg-red-500 dark:bg-red-400' : 'bg-amber-400 dark:bg-amber-300')}
    />
  )
}

function ItemLista({ ativo, onClick, titulo, detalhe, marcador }: { ativo: boolean; onClick: () => void; titulo: string; detalhe: string; marcador?: ReactNode }) {
  return (
    <li>
      <button
        onClick={onClick}
        className={cn(
          'w-full rounded-xl border px-4 py-3 text-left transition-colors',
          ativo
            ? 'border-sepa-500 bg-sepa-50 ring-1 ring-sepa-500 dark:bg-sepa-900/50'
            : 'border-slate-200 bg-white hover:border-sepa-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sepa-500',
        )}
      >
        <p className="flex items-center justify-between gap-2 font-medium text-slate-900 dark:text-slate-50">
          {titulo}
          {marcador}
        </p>
        <p className="text-xs text-slate-500 first-letter:uppercase dark:text-slate-400">{detalhe}</p>
      </button>
    </li>
  )
}

type Grupo = 'validar' | 'naoEnviadas'

/** Seção recolhível da lista. Só uma fica aberta por vez (controlado pela página). */
function GrupoLista({ id, titulo, total, aberto, onAlternar, children }: { id: string; titulo: string; total: number; aberto: boolean; onAlternar: () => void; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/40">
      <h2>
        <button
          type="button"
          onClick={onAlternar}
          aria-expanded={aberto}
          aria-controls={id}
          className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-800 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-sepa-500 dark:text-slate-100 dark:hover:bg-slate-800/60"
        >
          <span className="flex-1">{titulo}</span>
          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs tabular-nums text-slate-700 dark:bg-slate-700 dark:text-slate-200">{total}</span>
          <Icon nome="keyboard_arrow_down" size={20} className={cn('text-slate-400 transition-transform', aberto && 'rotate-180')} />
        </button>
      </h2>
      {aberto && (
        <div id={id} className="px-2 pb-2">
          {children}
        </div>
      )}
    </section>
  )
}

export function ValidacaoPage() {
  const toast = useToast()
  const [fila, setFila] = useState(fichasParaValidar)
  /** id da ficha a validar, ou `pend:<atuanteId>` para uma não enviada. */
  const [selecionada, setSelecionada] = useState<string | undefined>(fila[0]?.id)
  const [grupoAberto, setGrupoAberto] = useState<Grupo | null>('validar')
  /** No celular, lista e detalhe não cabem lado a lado: um de cada vez. */
  const [verDetalhe, setVerDetalhe] = useState(false)

  function abrir(id: string) {
    setSelecionada(id)
    setVerDetalhe(true)
    window.scrollTo({ top: 0 })
  }

  /** Abrir um grupo fecha o outro e já mostra a primeira ficha dele. */
  function alternar(g: Grupo) {
    if (grupoAberto === g) return setGrupoAberto(null)
    setGrupoAberto(g)
    const primeira = g === 'validar' ? fila[0]?.id : naoEnviadas[0] && `pend:${naoEnviadas[0].atuante.id}`
    if (primeira) setSelecionada(primeira)
  }

  const ficha = fila.find((f) => f.id === selecionada)
  const pendente = naoEnviadas.find((l) => `pend:${l.atuante.id}` === selecionada)

  function concluir(id: string, msg: string) {
    const resto = fila.filter((f) => f.id !== id)
    setFila(resto)
    if (!resto.length && naoEnviadas.length) setGrupoAberto('naoEnviadas')
    setSelecionada(resto[0]?.id ?? (naoEnviadas[0] && `pend:${naoEnviadas[0].atuante.id}`))
    setVerDetalhe(false)
    toast(msg)
  }

  return (
    <>
      <PageHeader
        titulo="Validar fichas"
        subtitulo={`${supervisorLogado.nome} · ${fila.length} para conferir · ${naoEnviadas.length} ainda não enviada(s)`}
      />

      <div className="grid gap-5 lg:min-h-[32rem] lg:grid-cols-[20rem_1fr]">
        <div className={cn('space-y-3', verDetalhe && 'hidden lg:block')}>
          <GrupoLista id="grupo-validar" titulo="Para validar" total={fila.length} aberto={grupoAberto === 'validar'} onAlternar={() => alternar('validar')}>
            <ul className="space-y-2" aria-label="Fichas aguardando validação">
              {fila.map((f) => (
                <ItemLista
                  key={f.id}
                  ativo={f.id === selecionada}
                  onClick={() => abrir(f.id)}
                  titulo={f.atuante.nome}
                  detalhe={`${nomeReferencia(f.referencia)} · ${f.atuante.vinculo} · enviada ${dataBR(f.enviadaEm)}${f.linhas.length ? "" : " · sem atendimentos"}`}
                  marcador={<Bolinha alerta={alertaDe(f.atuante.id)} />}
                />
              ))}
              {fila.length === 0 && (
                <li className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500 dark:border-slate-600 dark:text-slate-400">
                  Nenhuma ficha para validar.
                </li>
              )}
            </ul>
          </GrupoLista>

          {naoEnviadas.length > 0 && (
            <GrupoLista
              id="grupo-nao-enviadas"
              titulo="Não enviadas"
              total={naoEnviadas.length}
              aberto={grupoAberto === 'naoEnviadas'}
              onAlternar={() => alternar('naoEnviadas')}
            >
              <ul className="space-y-2" aria-label="Fichas não enviadas">
                {naoEnviadas.map((l) => (
                  <ItemLista
                    key={l.atuante.id}
                    ativo={`pend:${l.atuante.id}` === selecionada}
                    onClick={() => abrir(`pend:${l.atuante.id}`)}
                    titulo={l.atuante.nome}
                    detalhe={`${nomeReferencia('2026-10')} · ${l.atuante.vinculo} · ${l.status === 'nao_enviada' ? 'não iniciada' : `rascunho com ${l.sessoes ?? 0} sessões`}`}
                    marcador={<Bolinha alerta={alertaDe(l.atuante.id)} />}
                  />
                ))}
              </ul>
            </GrupoLista>
          )}

          <p className="flex items-center gap-4 px-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5"><Bolinha alerta="pendencia" /> Com pendência</span>
            <span className="flex items-center gap-1.5"><Bolinha alerta="bloqueado" /> Bloqueado</span>
          </p>
        </div>

        <div className={cn(!verDetalhe && 'hidden lg:block')}>
        <button
          type="button"
          onClick={() => setVerDetalhe(false)}
          className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-sepa-700 hover:text-sepa-900 lg:hidden dark:text-sepa-200 dark:hover:text-white"
        >
          <Icon nome="arrow_back" size={18} /> Voltar para a lista
        </button>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-800 dark:bg-slate-900">
          {ficha ? (
            <FichaDetalhe
              key={ficha.id}
              ficha={ficha}
              onValidar={() => concluir(ficha.id, `Ficha de ${ficha.atuante.nome} validada. O Registro foi notificado.`)}
              onDevolver={(_, excecaoAte) =>
                concluir(
                  ficha.id,
                  `Ficha devolvida a ${ficha.atuante.nome}.${excecaoAte ? ` Salas liberadas até ${dataBR(excecaoAte)}.` : ' Salas bloqueadas até a correção.'}`,
                )
              }
            />
          ) : pendente ? (
            <FichaNaoEnviada key={pendente.atuante.id} linha={pendente} onCobrar={() => toast(`Lembrete enviado a ${pendente.atuante.nome}.`)} />
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">Selecione uma ficha.</p>
          )}
        </div>
        </div>
      </div>
    </>
  )
}
