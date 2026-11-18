import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { DataTable } from '../../components/ui/DataTable'
import { SelectMenu } from '../../components/ui/SelectMenu'
import { PageHeader } from '../../components/ui/PageHeader'
import { StatTile } from '../../components/ui/StatTile'
import { SituacaoSalaBadge, StatusFichaBadge } from '../../components/ui/StatusBadge'
import { useToast } from '../../context/ToastContext'
import { painelOutubro } from '../../data/mock'
import { IconNotificar } from '../../components/ui/icons'

/** Substitui os "verdinhos e vermelhinhos" da planilha e a planilha de permissão de salas. */
export function PainelMesPage() {
  const toast = useToast()
  const [filtro, setFiltro] = useState('todos')

  const linhas = painelOutubro.filter((l) => filtro === 'todos' || l.atuante.vinculo === filtro)
  const enviadas = painelOutubro.filter((l) => l.enviadaEm).length
  const validadas = painelOutubro.filter((l) => l.status === 'validada').length
  const pendentes = painelOutubro.filter((l) => l.status === 'nao_enviada' || l.status === 'atrasada')
  const bloqueados = painelOutubro.filter((l) => l.sala === 'bloqueado').length

  return (
    <>
      <PageHeader
        titulo="Painel do mês"
        subtitulo="Fichas de outubro/2026 · prazo encerrado em 05/11 · janela de salas 15/11 → 15/12"
        acoes={
          <Button onClick={() => toast(`Lembrete enviado para ${pendentes.length} pessoa(s) com ficha pendente.`)} disabled={!pendentes.length}>
            <IconNotificar size={18} /> Cobrar pendentes ({pendentes.length})
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile rotulo="Fichas esperadas" valor={painelOutubro.length} />
        <StatTile rotulo="Enviadas" valor={enviadas} detalhe={`${painelOutubro.length - enviadas} sem envio`} />
        <StatTile rotulo="Validadas pelo supervisor" valor={validadas} />
        <StatTile rotulo="Bloqueados para salas" valor={bloqueados} detalhe="Repassado ao módulo de Reserva de Salas" />
      </div>

      <Card
        titulo="Situação por atuante"
        acoes={
          <SelectMenu
            ariaLabel="Filtrar por vínculo"
            tamanho="sm"
            className="w-48"
            value={filtro}
            onChange={setFiltro}
            opcoes={[
              { valor: 'todos', rotulo: 'Todos os vínculos' },
              { valor: '4º ano', rotulo: '4º ano' },
              { valor: '5º ano', rotulo: '5º ano' },
              { valor: 'Extensão', rotulo: 'Extensão' },
              { valor: 'Técnico', rotulo: 'Técnico' },
            ]}
          />
        }
      >
        <DataTable
          chaveLinha={(l) => l.atuante.id}
          linhas={linhas}
          colunas={[
            {
              chave: 'nome',
              titulo: 'Atuante',
              render: (l) => (
                <>
                  <p className="font-medium text-slate-900 dark:text-slate-50">{l.atuante.nome}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{l.atuante.projeto ? `${l.atuante.vinculo} · ${l.atuante.projeto}` : l.atuante.vinculo}</p>
                </>
              ),
            },
            { chave: 'sup', titulo: 'Supervisor', render: (l) => l.atuante.supervisor },
            { chave: 'ficha', titulo: 'Ficha', render: (l) => <StatusFichaBadge status={l.status} /> },
            { chave: 'envio', titulo: 'Enviada', render: (l) => l.enviadaEm ?? '—' },
            { chave: 'sala', titulo: 'Salas', render: (l) => <SituacaoSalaBadge situacao={l.sala} /> },
            { chave: 'obs', titulo: 'Observação', render: (l) => <span className="text-xs text-slate-600 dark:text-slate-300">{l.observacao ?? ''}</span> },
          ]}
        />
      </Card>
    </>
  )
}
