import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { DataTable } from '../../components/ui/DataTable'
import { IconAdicionar } from '../../components/ui/icons'
import { PageHeader } from '../../components/ui/PageHeader'
import { Badge } from '../../components/ui/StatusBadge'
import { useToast } from '../../context/ToastContext'
import { atividades as base } from '../../data/mock'
import { dataBR } from '../../lib/datas'
import { RegistrarAtividadeModal } from './RegistrarAtividadeModal'

export function AtividadesPage() {
  const toast = useToast()
  const [lista, setLista] = useState(base)
  const [modalAberto, setModalAberto] = useState(false)

  return (
    <>
      <PageHeader
        titulo="Atividades coletivas"
        subtitulo="Reuniões, formações, supervisões, grupos e ações do Interações. Alimenta os quadros do Relatório de Gestão."
        acoes={
          <Button onClick={() => setModalAberto(true)}>
            <IconAdicionar size={18} /> Registrar atividade
          </Button>
        }
      />

      <RegistrarAtividadeModal
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        onSalvar={(nova) => {
          setLista((l) => [nova, ...l])
          toast('Atividade registrada.')
        }}
      />

      <Card titulo="Registradas em novembro/2026">
        <DataTable
          chaveLinha={(a) => a.id}
          linhas={lista}
          colunas={[
            { chave: 'data', titulo: 'Data', render: (a) => <span className="tabular-nums">{dataBR(a.data)}</span> },
            { chave: 'tit', titulo: 'Atividade', render: (a) => <><p className="font-medium text-slate-900 dark:text-slate-50">{a.titulo}</p>{a.projeto && <p className="text-xs text-slate-500 dark:text-slate-400">{a.projeto}</p>}</> },
            { chave: 'cat', titulo: 'Categoria', render: (a) => a.categoria },
            { chave: 'local', titulo: 'Local', render: (a) => (a.noEspacoSEPA ? <Badge tom="info">No SEPA</Badge> : <Badge tom="neutro">Externo</Badge>) },
            { chave: 'part', titulo: 'Participações', alinhar: 'direita', render: (a) => a.participacoes },
          ]}
        />
      </Card>
    </>
  )
}
