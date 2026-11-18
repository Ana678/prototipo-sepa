import { useState } from 'react'
import { Alert } from '../../components/ui/Alert'
import { Card } from '../../components/ui/Card'
import { DataTable } from '../../components/ui/DataTable'
import { Input } from '../../components/ui/Field'
import { SelectMenu, type Opcao } from '../../components/ui/SelectMenu'
import { PageHeader } from '../../components/ui/PageHeader'
import { Badge } from '../../components/ui/StatusBadge'
import { HOJE, usuarios as base } from '../../data/mock'
import { dataBR, mesesEntre } from '../../lib/datas'
import { IconBuscar } from '../../components/ui/icons'
import type { Desfecho, Usuario } from '../../types'

const TOM_DESFECHO: Record<Desfecho, Opcao['tom']> = {
  'Em atendimento': 'neutro',
  Desistência: 'aviso',
  'Perda de vaga por faltas': 'aviso',
  'Encerrado / Alta': 'ok',
  'Encaminhado (interno)': 'info',
  'Encaminhado (externo)': 'info',
  'Lista de espera': 'info',
  Suspenso: 'aviso',
  'Segue no próximo ano': 'neutro',
}
const OPCOES_DESFECHO: Opcao<Desfecho>[] = (Object.keys(TOM_DESFECHO) as Desfecho[]).map((d) => ({ valor: d, rotulo: d, tom: TOM_DESFECHO[d] }))
const OPCOES_DESFECHO_2: Opcao<Desfecho | ''>[] = [{ valor: '', rotulo: 'Nenhuma', tom: 'neutro' }, ...OPCOES_DESFECHO]

/** Regra do SEPA: o usuário é atendido por 1 ano, prorrogável por mais 1 conforme o caso. */
function situacaoPrazo(u: Usuario) {
  const meses = mesesEntre(u.primeiroAtendimento, HOJE)
  if (u.desfecho1 !== 'Em atendimento') return { meses, badge: null }
  if (meses >= 24) return { meses, badge: <Badge tom="erro">Passou de 2 anos</Badge> }
  if (meses >= 12) return { meses, badge: <Badge tom="aviso">Em prorrogação</Badge> }
  if (meses >= 10) return { meses, badge: <Badge tom="info">Perto de 1 ano</Badge> }
  return { meses, badge: null }
}

export function UsuariosPage() {
  const [lista, setLista] = useState(base)
  const [busca, setBusca] = useState('')

  const filtrados = lista.filter((u) => u.nome.toLowerCase().includes(busca.toLowerCase()))
  const alertas = lista.filter((u) => u.desfecho1 === 'Em atendimento' && mesesEntre(u.primeiroAtendimento, HOJE) >= 10).length

  function mudarDesfecho(id: string, campo: 'desfecho1' | 'desfecho2', valor: string) {
    setLista((l) => l.map((u) => (u.id === id ? { ...u, [campo]: (valor || undefined) as Desfecho } : u)))
  }

  return (
    <>
      <PageHeader titulo="Usuários e casos" subtitulo="Visão consolidada de todas as fichas — um registro por usuário, mesmo em várias modalidades." />

      {alertas > 0 && (
        <div className="mb-5">
          <Alert tom="aviso" titulo={`${alertas} usuário(s) perto ou além do limite de 1 ano de atendimento`}>
            Calculado a partir da data do primeiro atendimento registrado nas fichas — sem levantamento manual.
          </Alert>
        </div>
      )}

      <Card titulo="Usuários" acoes={
          <div className="relative">
            <IconBuscar size={18} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <Input placeholder="Buscar por nome…" value={busca} onChange={(e) => setBusca(e.target.value)} className="w-64 py-1.5 pl-9" />
          </div>
        }>
        <DataTable
          chaveLinha={(u) => u.id}
          linhas={filtrados}
          colunas={[
            {
              chave: 'nome',
              titulo: 'Usuário',
              render: (u) => (
                <>
                  <p className="font-medium text-slate-900 dark:text-slate-50">{u.nome}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {u.vinculoUFRN}
                    {u.curso ? ` · ${u.curso}` : ''}
                  </p>
                </>
              ),
            },
            { chave: 'mod', titulo: 'Modalidades', render: (u) => <span className="text-slate-700 dark:text-slate-200">{u.modalidades.join(', ')}</span> },
            {
              chave: 'inicio',
              titulo: 'Em atendimento desde',
              render: (u) => {
                const s = situacaoPrazo(u)
                return (
                  <div className="space-y-1">
                    <p className="tabular-nums">{dataBR(u.primeiroAtendimento)} <span className="text-xs text-slate-500 dark:text-slate-400">({s.meses} meses)</span></p>
                    {s.badge}
                  </div>
                )
              },
            },
            {
              chave: 'd1',
              titulo: 'Situação 1',
              render: (u) => (
                <SelectMenu ariaLabel="Situação 1" tamanho="sm" className="w-56" value={u.desfecho1} onChange={(v) => mudarDesfecho(u.id, 'desfecho1', v)} opcoes={OPCOES_DESFECHO} />
              ),
            },
            {
              chave: 'd2',
              titulo: 'Situação 2',
              render: (u) => (
                <SelectMenu ariaLabel="Situação 2" tamanho="sm" className="w-56" value={u.desfecho2 ?? ''} onChange={(v) => mudarDesfecho(u.id, 'desfecho2', v)} opcoes={OPCOES_DESFECHO_2} />
              ),
            },
          ]}
        />
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Dois campos de situação porque um encaminhamento (ex.: para fonoaudiologia) não significa que o atendimento no SEPA foi encerrado.</p>
      </Card>
    </>
  )
}
