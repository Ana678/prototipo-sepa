import { useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { SelectMenu, opcoesDe } from '../../../components/ui/SelectMenu'
import { IconAdicionar } from '../../../components/ui/icons'
import { MODALIDADES, type LinhaSessao, type Modalidade, type Usuario } from '../../../types'

interface Props {
  usuarios: Usuario[]
  existentes: LinhaSessao[]
  onAdicionar: (modalidade: Modalidade, usuarioId: string) => void
}

/** Escolhe modalidade + usuário de uma vez; a linha já nasce identificada (sem selects soltos na lista). */
export function AdicionarUsuario({ usuarios, existentes, onAdicionar }: Props) {
  const [aberto, setAberto] = useState(false)
  const [modalidade, setModalidade] = useState<Modalidade>('Psicoterapia')
  const [usuarioId, setUsuarioId] = useState('')

  const disponiveis = usuarios.filter((u) => !existentes.some((l) => l.modalidade === modalidade && l.usuarioId === u.id))

  if (!aberto) {
    return (
      <Button variante="secundario" onClick={() => setAberto(true)}>
        <IconAdicionar size={18} /> Adicionar usuário atendido
      </Button>
    )
  }

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50">
      <SelectMenu
        label="Modalidade"
        className="w-56"
        value={modalidade}
        onChange={(m) => { setModalidade(m); setUsuarioId('') }}
        opcoes={opcoesDe(MODALIDADES)}
      />
      <SelectMenu
        label="Usuário"
        className="w-72"
        value={usuarioId}
        onChange={setUsuarioId}
        placeholder={disponiveis.length ? 'Selecione o usuário…' : 'Todos já estão nesta modalidade'}
        disabled={!disponiveis.length}
        opcoes={disponiveis.map((u) => ({ valor: u.id, rotulo: u.nome, descricao: `${u.vinculoUFRN} · CPF ${u.cpf}` }))}
      />
      <Button disabled={!usuarioId} onClick={() => { onAdicionar(modalidade, usuarioId); setUsuarioId(''); setAberto(false) }}>
        Adicionar
      </Button>
      <Button variante="fantasma" onClick={() => setAberto(false)}>Cancelar</Button>
    </div>
  )
}
