import { useState, type FormEvent } from 'react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { DataTable } from '../../components/ui/DataTable'
import { Input, Label } from '../../components/ui/Field'
import { SelectMenu, opcoesDe } from '../../components/ui/SelectMenu'
import { PageHeader } from '../../components/ui/PageHeader'
import { Badge } from '../../components/ui/StatusBadge'
import { useToast } from '../../context/ToastContext'
import { atividades as base } from '../../data/mock'
import { dataBR } from '../../lib/datas'
import type { AtividadeColetiva, CategoriaAtividade } from '../../types'

const CATEGORIAS: CategoriaAtividade[] = [
  'Atividade Interna do Serviço',
  'Ações Formativas',
  'Supervisão de Estágio',
  'Grupo',
  'Ações de Promoção em Saúde',
  'Projeto Interações (fora do SEPA)',
]

/** Categoria escolhida numa lista fechada no momento do registro — acaba a dúvida "onde eu boto isso?". */
export function AtividadesPage() {
  const toast = useToast()
  const [lista, setLista] = useState(base)
  const [form, setForm] = useState({ titulo: '', data: '2026-11-18', categoria: CATEGORIAS[0], projeto: '', participacoes: '' })

  function salvar(e: FormEvent) {
    e.preventDefault()
    const nova: AtividadeColetiva = {
      id: crypto.randomUUID(),
      titulo: form.titulo,
      data: form.data,
      categoria: form.categoria,
      projeto: form.projeto || undefined,
      participacoes: Number(form.participacoes),
      noEspacoSEPA: form.categoria !== 'Projeto Interações (fora do SEPA)',
    }
    setLista([nova, ...lista])
    setForm({ ...form, titulo: '', projeto: '', participacoes: '' })
    toast('Atividade registrada.')
  }

  const valido = form.titulo.trim() && Number(form.participacoes) > 0

  return (
    <>
      <PageHeader titulo="Atividades coletivas" subtitulo="Reuniões, formações, supervisões, grupos e ações do Interações. Alimenta os quadros do Relatório de Gestão." />

      <Card titulo="Registrar atividade" className="mb-5">
        <form onSubmit={salvar} className="grid grid-cols-1 gap-4 md:grid-cols-6">
          <div className="md:col-span-2">
            <Label htmlFor="titulo">Atividade</Label>
            <Input id="titulo" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Ex.: Reunião com supervisores" />
          </div>
          <div>
            <Label htmlFor="data">Data</Label>
            <Input id="data" type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} />
          </div>
          <SelectMenu
            label="Categoria"
            className="md:col-span-2"
            value={form.categoria}
            onChange={(categoria: CategoriaAtividade) => setForm({ ...form, categoria })}
            opcoes={opcoesDe(CATEGORIAS)}
          />
          <div>
            <Label htmlFor="part">Participações</Label>
            <Input id="part" type="number" min={1} value={form.participacoes} onChange={(e) => setForm({ ...form, participacoes: e.target.value })} />
          </div>
          <div className="md:col-span-3">
            <Label htmlFor="proj">Projeto de extensão vinculado (opcional)</Label>
            <Input id="proj" value={form.projeto} onChange={(e) => setForm({ ...form, projeto: e.target.value })} placeholder="Ex.: Projeto Acolher" />
          </div>
          <div className="flex items-end md:col-span-3 md:justify-end">
            <Button type="submit" disabled={!valido}>Registrar</Button>
          </div>
        </form>
      </Card>

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
