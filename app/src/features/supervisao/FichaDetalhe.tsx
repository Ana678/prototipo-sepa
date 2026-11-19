import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Input, Label, Textarea } from '../../components/ui/Field'
import { Icon, IconDevolver, IconOk } from '../../components/ui/icons'
import { Badge } from '../../components/ui/StatusBadge'
import { HOJE, usuarios, type FichaParaValidar } from '../../data/mock'
import { useProntuarios } from '../../context/ProntuarioContext'
import { ESTILO_SESSAO } from '../prontuarios/estiloSessao'
import { RevisarProntuarioModal } from '../prontuarios/RevisarProntuarioModal'
import type { Prontuario } from '../../types'
import { cn } from '../../lib/cn'
import { dataBR, nomeReferencia } from '../../lib/datas'
import type { SituacaoMes } from '../../types'
import { dataCurta } from '../permissao/permissoes'
import { janelaVigente } from '../permissao/regraPermissao'
import { ConferenciaChave } from './ConferenciaChave'
import { declaracaoDe } from '../registro/cruzamentoUsoSala'

interface Props {
  ficha: FichaParaValidar
  onValidar: () => void
  /** `excecaoAte` preenchido = não bloquear salas até essa data. */
  onDevolver: (motivo: string, excecaoAte?: string) => void
}

/** Só as situações fora do normal ganham selo; "Segue em atendimento" fica sem nada. */
const SELO: Partial<Record<SituacaoMes, 'info' | 'aviso' | 'ok'>> = {
  'Iniciou neste mês': 'info',
  Desistiu: 'aviso',
  'Perdeu a vaga por faltas': 'aviso',
  'Alta / encerramento': 'ok',
  Encaminhado: 'info',
}

const janela = janelaVigente(HOJE)

/** Substitui o e-mail "zero pendências": o supervisor confere os prontuários de cada sessão e decide aqui. */
export function FichaDetalhe({ ficha, onValidar, onDevolver }: Props) {
  const [modo, setModo] = useState<'ver' | 'devolver'>('ver')
  const [motivo, setMotivo] = useState('')
  const [salas, setSalas] = useState<'bloquear' | 'excecao'>('bloquear')
  const [excecaoAte, setExcecaoAte] = useState('2026-11-21')

  const primeiroNome = ficha.atuante.nome.split(' ')[0]
  const { daSessao } = useProntuarios()
  const [lendo, setLendo] = useState<Prontuario | null>(null)
  /** Prontuário de uma data da ficha ("dd/mm" + nome do usuário, como vem na ficha). */
  const prontuarioDe = (usuario: string, dm: string) =>
    daSessao(ficha.atuante.id, usuarios.find((u) => u.nome === usuario)?.id ?? usuario, `${ficha.referencia}-${dm.slice(0, 2)}`)
  const todasDatas = ficha.linhas.flatMap((l) => l.datas.map((d) => prontuarioDe(l.usuario, d)))
  const validados = todasDatas.filter((p) => p?.status === 'validado').length
  const bloqueioAuto = declaracaoDe(ficha.atuante.id).pendencias.some((p) => p.vencida)
  const totalSessoes = ficha.linhas.reduce((s, l) => s + l.datas.length, 0)
  const modalidades = [...new Set(ficha.linhas.map((l) => l.modalidade))]

  return (
    <div className="flex h-full flex-col">
      {/* Cabeçalho: quem, qual mês e o tamanho da ficha */}
      <header className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{ficha.atuante.nome}</h2>
          <p className="text-sm text-slate-500 first-letter:uppercase dark:text-slate-400">
            Ficha de {nomeReferencia(ficha.referencia)} · {ficha.atuante.vinculo} · enviada em {dataBR(ficha.enviadaEm)}
          </p>
        </div>
        <dl className="flex shrink-0 gap-6 sm:text-right">
          <div>
            <dt className="text-xs text-slate-500 dark:text-slate-400">Usuários</dt>
            <dd className="text-xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">{ficha.linhas.length}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 dark:text-slate-400">Sessões</dt>
            <dd className="text-xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">{totalSessoes}</dd>
          </div>
        </dl>
      </header>

      <div className="flex-1 space-y-5 overflow-y-auto py-5">
        <p className="flex items-center gap-2 rounded-lg bg-sepa-50 px-3 py-2 text-sm text-sepa-900 dark:bg-sepa-400/15 dark:text-sepa-100">
          <Icon nome="checklist" size={20} className="text-sepa-600 dark:text-sepa-300" />
          {ficha.linhas.length
            ? `Cada data abre o prontuário da sessão (${validados} de ${todasDatas.length} já validados). Confira também as retiradas de chave abaixo. Se tudo bater, valide.`
            : 'Sem sessões, não há prontuários. Leia a justificativa e confira as retiradas de chave. Se tudo bater, valide.'}
        </p>

        {ficha.linhas.length === 0 && (
          <section className="rounded-lg border border-slate-200 px-4 py-3 dark:border-slate-800">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-50">Sem atendimentos neste mês</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              <span className="text-slate-500 dark:text-slate-400">Justificativa: </span>
              {ficha.justificativa}
            </p>
          </section>
        )}

        {/* Sessões agrupadas por modalidade, como na ficha do aluno */}
        {modalidades.map((mod) => {
          const linhas = ficha.linhas.filter((l) => l.modalidade === mod)
          return (
            <section key={mod}>
              <h3 className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                {mod} <span className="font-normal normal-case">· {linhas.reduce((s, l) => s + l.datas.length, 0)} sessões</span>
              </h3>
              <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
                {linhas.map((l) => (
                  <li key={l.usuario} className="flex flex-wrap items-start gap-x-4 gap-y-2 px-4 py-3 sm:flex-nowrap">
                    <div className="min-w-0 flex-1 sm:w-48 sm:flex-none">
                      <p className="font-medium text-slate-900 dark:text-slate-50">{l.usuario}</p>
                      {SELO[l.situacao] && (
                        <div className="mt-1">
                          <Badge tom={SELO[l.situacao]!}>{l.situacao}</Badge>
                        </div>
                      )}
                    </div>
                    <div className="order-last w-full min-w-0 sm:order-none sm:w-auto sm:flex-1">
                      <div className="flex flex-wrap gap-1.5">
                        {l.datas.map((d) => {
                          const pr = prontuarioDe(l.usuario, d)
                          const est = ESTILO_SESSAO[pr?.status ?? 'sem']
                          return (
                            <button
                              key={d}
                              type="button"
                              disabled={!pr}
                              onClick={() => pr && setLendo(pr)}
                              title={`${d}: ${est.texto}`}
                              aria-label={`${d}, ${est.texto}${pr ? '. Abrir prontuário' : ''}`}
                              className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-sm tabular-nums text-slate-700 hover:bg-sepa-50 hover:text-sepa-800 disabled:cursor-default disabled:hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-sepa-900/60"
                            >
                              <Icon nome={est.icone} size={14} className={est.cor} />
                              {d}
                            </button>
                          )
                        })}
                      </div>
                      {l.observacao && <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{l.observacao}</p>}
                    </div>
                    <span className="w-8 text-right text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-50" title="Sessões no mês">
                      {l.datas.length}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}

        <ConferenciaChave atuanteId={ficha.atuante.id} nome={ficha.atuante.nome} referencia={ficha.referencia} />

        {modo === 'devolver' && (
          <section className="space-y-4 rounded-xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-400/20 dark:bg-amber-400/5">
            <div>
              <Label htmlFor="motivo">O que precisa ser corrigido?</Label>
              <Textarea id="motivo" rows={3} autoFocus value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Ex.: prontuário de 16/10 ainda não foi enviado." />
            </div>

            <fieldset>
              <legend className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">Enquanto corrige, {primeiroNome} pode usar as salas?</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {(
                  [
                    { valor: 'bloquear', titulo: 'Não, bloquear', texto: 'Libera quando a ficha corrigida for validada.' },
                    { valor: 'excecao', titulo: 'Sim, até uma data', texto: 'A correção já foi combinada com você.' },
                  ] as const
                ).map((o) => (
                  <label
                    key={o.valor}
                    className={cn(
                      'flex cursor-pointer items-start gap-2.5 rounded-lg border bg-white px-3 py-2.5 dark:bg-slate-900',
                      salas === o.valor ? 'border-sepa-500 ring-1 ring-sepa-500' : 'border-slate-200 hover:border-slate-300 dark:border-slate-700',
                    )}
                  >
                    <input type="radio" name="salas" checked={salas === o.valor} onChange={() => setSalas(o.valor)} className="mt-1 accent-sepa-600" />
                    <span>
                      <span className="block text-sm font-medium text-slate-900 dark:text-slate-50">{o.titulo}</span>
                      <span className="block text-xs text-slate-500 dark:text-slate-400">{o.texto}</span>
                    </span>
                  </label>
                ))}
              </div>
              {salas === 'excecao' && (
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <label htmlFor="excecao-ate" className="text-sm font-medium whitespace-nowrap text-slate-700 dark:text-slate-200">
                    Salas liberadas até
                  </label>
                  <Input id="excecao-ate" type="date" className="w-44" min={HOJE} max={janela.fim} value={excecaoAte} onChange={(e) => setExcecaoAte(e.target.value)} />
                </div>
              )}
            </fieldset>
          </section>
        )}
      </div>

      {/* Ação + consequência para as salas, sempre visível */}
      <footer className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <p className="flex min-w-60 flex-1 items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
          <Icon nome="key" size={18} />
          {modo === 'ver' && bloqueioAuto
            ? `Mesmo validando, o acesso de ${primeiroNome} às salas segue bloqueado até declarar os atendimentos pendentes.`
            : modo === 'ver'
            ? `Ao validar, ${primeiroNome} pode usar as salas de ${dataCurta(janela.inicio)} a ${dataCurta(janela.fim)}.`
            : salas === 'bloquear'
              ? `${primeiroNome} fica sem acesso às salas até a correção ser validada.`
              : `${primeiroNome} pode usar as salas até ${excecaoAte ? dataCurta(excecaoAte) : '—'}, mesmo com a pendência.`}
        </p>
        <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:shrink-0 [&>*]:flex-1 sm:[&>*]:flex-none">
          {modo === 'ver' ? (
            <>
              <Button variante="perigo" onClick={() => setModo('devolver')}>
                <IconDevolver size={18} /> Devolver para correção
              </Button>
              <Button onClick={onValidar}>
                <IconOk size={18} /> Validar ficha
              </Button>
            </>
          ) : (
            <>
              <Button variante="fantasma" onClick={() => setModo('ver')}>Cancelar</Button>
              <Button disabled={!motivo.trim() || (salas === 'excecao' && !excecaoAte)} onClick={() => onDevolver(motivo, salas === 'excecao' ? excecaoAte : undefined)}>
                <IconDevolver size={18} /> Enviar devolução
              </Button>
            </>
          )}
        </div>
      </footer>
      {lendo && <RevisarProntuarioModal key={lendo.id} prontuario={lendo} onFechar={() => setLendo(null)} />}
    </div>
  )
}
