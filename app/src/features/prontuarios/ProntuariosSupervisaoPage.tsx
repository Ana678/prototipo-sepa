import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { DataTable } from '../../components/ui/DataTable'
import { PageHeader } from '../../components/ui/PageHeader'
import { SelectMenu } from '../../components/ui/SelectMenu'
import { StatusProntuarioBadge } from '../../components/ui/StatusBadge'
import { useProntuarios } from '../../context/ProntuarioContext'
import { supervisorLogado, usuarios } from '../../data/mock'
import { NOMES_ATUANTES } from '../../data/prontuarios'
import { dataBR } from '../../lib/datas'
import type { Prontuario } from '../../types'
import { AvisoSigilo } from './HistoricoProntuario'
import { ordenar, ultimoComentario, type FiltroProntuario } from './lista'
import { RevisarProntuarioModal } from './RevisarProntuarioModal'

/** Para o supervisor, o que espera por ele vem primeiro. */
const ORDEM_SUPERVISOR = { aguardando_supervisor: 0, devolvido: 1, validado: 2, rascunho: 3 } as const

/** Supervisor: prontuários enviados pelos seus supervisionados. Rascunhos do aluno não aparecem aqui. */
export function ProntuariosSupervisaoPage() {
  const { prontuarios } = useProntuarios()
  const meus = prontuarios.filter((p) => p.atuanteId in NOMES_ATUANTES && p.status !== 'rascunho')
  const [filtro, setFiltro] = useState<FiltroProntuario>('aguardando_supervisor')
  const [aberto, setAberto] = useState<Prontuario | null>(null)

  const conta = (s: Prontuario['status']) => meus.filter((p) => p.status === s).length
  const linhas = ordenar(filtro === 'todos' ? meus : meus.filter((p) => p.status === filtro), ORDEM_SUPERVISOR)

  return (
    <>
      <PageHeader
        titulo="Prontuários"
        subtitulo={`${supervisorLogado.nome} · ${conta('aguardando_supervisor')} para conferir · ${conta('devolvido')} ${conta('devolvido') === 1 ? 'devolvido' : 'devolvidos'} aguardando correção`}
      />
      <div className="mb-5">
        <AvisoSigilo />
      </div>

      <Card
        titulo="Prontuários dos supervisionados"
        acoes={
          <SelectMenu
            ariaLabel="Filtrar por situação"
            tamanho="sm"
            className="w-60"
            value={filtro}
            onChange={setFiltro}
            opcoes={[
              { valor: 'aguardando_supervisor', rotulo: `Para conferir (${conta('aguardando_supervisor')})`, tom: 'info' },
              { valor: 'devolvido', rotulo: `Devolvidos (${conta('devolvido')})`, descricao: 'Aguardando correção do aluno', tom: 'aviso' },
              { valor: 'validado', rotulo: `Validados (${conta('validado')})`, tom: 'ok' },
              { valor: 'todos', rotulo: `Todos (${meus.length})` },
            ]}
          />
        }
      >
        <DataTable
          chaveLinha={(p) => p.id}
          linhas={linhas}
          vazio="Nada para conferir agora."
          colunas={[
            {
              chave: 'aluno',
              titulo: 'Aluno',
              render: (p) => (
                <button type="button" onClick={() => setAberto(p)} className="text-left">
                  <span className="block font-medium text-slate-900 hover:text-sepa-700 hover:underline dark:text-slate-50 dark:hover:text-sepa-200">{NOMES_ATUANTES[p.atuanteId]}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {usuarios.find((u) => u.id === p.usuarioId)?.nome} · {p.modalidade}
                  </span>
                </button>
              ),
            },
            { chave: 'data', titulo: 'Sessão', render: (p) => <span className="tabular-nums">{dataBR(p.data)}</span> },
            {
              chave: 'situacao',
              titulo: 'Situação',
              render: (p) => (
                <div className="space-y-1">
                  <StatusProntuarioBadge status={p.status} />
                  {p.eventos.some((e) => e.acao === 'reenviado') && p.status === 'aguardando_supervisor' && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">Corrigido após devolução</p>
                  )}
                </div>
              ),
            },
            {
              chave: 'comentario',
              titulo: 'Último comentário',
              render: (p) => {
                const c = ultimoComentario(p)
                return c && <span className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">“{c.comentario}”</span>
              },
            },
            {
              chave: 'acao',
              titulo: '',
              alinhar: 'direita',
              render: (p) => (
                <Button tamanho="sm" variante={p.status === 'aguardando_supervisor' ? 'primario' : 'secundario'} onClick={() => setAberto(p)}>
                  {p.status === 'aguardando_supervisor' ? 'Conferir' : 'Ver'}
                </Button>
              ),
            },
          ]}
        />
      </Card>

      {aberto && <RevisarProntuarioModal key={aberto.id} prontuario={aberto} onFechar={() => setAberto(null)} />}
    </>
  )
}
