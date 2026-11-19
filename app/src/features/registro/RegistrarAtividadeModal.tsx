import { useState, type FormEvent } from 'react'
import { Button } from '../../components/ui/Button'
import { Input, Label } from '../../components/ui/Field'
import { Modal } from '../../components/ui/Modal'
import { SelectMenu, opcoesDe } from '../../components/ui/SelectMenu'
import { HOJE, supervisores } from '../../data/mock'
import { PROJETOS } from '../relatorios/mapeamentos'
import type { AtividadeColetiva, CategoriaAtividade } from '../../types'

export const CATEGORIAS: CategoriaAtividade[] = [
  'Atividade Interna do Serviço',
  'Ações Formativas',
  'Supervisão de Estágio',
  'Grupo',
  'Ações de Promoção em Saúde',
  'Representação do SEPA',
  'Projeto Interações (fora do SEPA)',
]

const VAZIO = { titulo: '', data: HOJE, categoria: CATEGORIAS[0], projeto: '', supervisor: '', participacoes: '' }

const OPCOES_PROJETO = [
  { valor: '', rotulo: 'Nenhum' },
  ...PROJETOS.map((p) => ({ valor: p.nome, rotulo: p.nome, descricao: p.proprio ? 'Projeto próprio: fica fora do relatório do Interações' : 'Conta no relatório do Interações' })),
]

interface Props {
  aberto: boolean
  onFechar: () => void
  onSalvar: (atividade: AtividadeColetiva) => void
}

/** Categoria escolhida numa lista fechada no momento do registro — acaba a dúvida "onde eu boto isso?". */
export function RegistrarAtividadeModal({ aberto, onFechar, onSalvar }: Props) {
  const [form, setForm] = useState(VAZIO)
  const ehSupervisao = form.categoria === 'Supervisão de Estágio'
  const valido = form.titulo.trim() !== '' && Number(form.participacoes) > 0 && (!ehSupervisao || form.supervisor !== '')

  function fechar() {
    setForm(VAZIO)
    onFechar()
  }

  function salvar(e: FormEvent) {
    e.preventDefault()
    if (!valido) return
    onSalvar({
      id: crypto.randomUUID(),
      titulo: form.titulo.trim(),
      data: form.data,
      categoria: form.categoria,
      projeto: form.projeto || undefined,
      supervisor: ehSupervisao ? form.supervisor : undefined,
      participacoes: Number(form.participacoes),
      noEspacoSEPA: form.categoria !== 'Projeto Interações (fora do SEPA)',
    })
    fechar()
  }

  return (
    <Modal
      aberto={aberto}
      onFechar={fechar}
      titulo="Registrar atividade coletiva"
      descricao="Reunião, formação, supervisão, grupo ou ação do Interações."
      acoes={
        <>
          <Button variante="secundario" onClick={fechar}>Cancelar</Button>
          <Button type="submit" form="form-atividade" disabled={!valido}>Registrar</Button>
        </>
      }
    >
      <form id="form-atividade" onSubmit={salvar} className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="titulo">Atividade</Label>
          <Input id="titulo" autoFocus value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Ex.: Reunião com supervisores" />
        </div>
        <SelectMenu
          label="Categoria"
          className="col-span-2"
          value={form.categoria}
          onChange={(categoria: CategoriaAtividade) => setForm({ ...form, categoria })}
          opcoes={opcoesDe(CATEGORIAS)}
        />
        <div>
          <Label htmlFor="data">Data</Label>
          <Input id="data" type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="part">Participações</Label>
          <Input id="part" type="number" min={1} value={form.participacoes} onChange={(e) => setForm({ ...form, participacoes: e.target.value })} placeholder="Nº de pessoas" />
        </div>
        {ehSupervisao && (
          <SelectMenu
            label="Supervisor(a)"
            className="col-span-2"
            placeholder="Quem conduziu a supervisão?"
            value={form.supervisor}
            onChange={(supervisor) => setForm({ ...form, supervisor })}
            opcoes={opcoesDe(supervisores)}
          />
        )}
        <SelectMenu
          label="Projeto de extensão vinculado"
          className="col-span-2"
          value={form.projeto}
          onChange={(projeto) => setForm({ ...form, projeto })}
          opcoes={OPCOES_PROJETO}
        />
        {form.categoria === 'Projeto Interações (fora do SEPA)' && (
          <p className="col-span-2 text-xs text-slate-500 dark:text-slate-400">Conta como atividade externa, no relatório do Interações (não entra no quadro de atividades no espaço do SEPA).</p>
        )}
      </form>
    </Modal>
  )
}
