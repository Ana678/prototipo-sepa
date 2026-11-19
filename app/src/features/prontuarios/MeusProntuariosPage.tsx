import { useState } from 'react'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { DataTable } from '../../components/ui/DataTable'
import { IconAdicionar } from '../../components/ui/icons'
import { PageHeader } from '../../components/ui/PageHeader'
import { SelectMenu } from '../../components/ui/SelectMenu'
import { StatusProntuarioBadge } from '../../components/ui/StatusBadge'
import { useProntuarios } from '../../context/ProntuarioContext'
import { atuanteLogado, usuarios } from '../../data/mock'
import { dataBR } from '../../lib/datas'
import type { Prontuario } from '../../types'
import { AvisoSigilo } from './HistoricoProntuario'
import { ordenar, ultimoComentario, type FiltroProntuario } from './lista'
import { ProntuarioModal } from './ProntuarioModal'

/** Aluno: registra o prontuário de cada sessão e acompanha a conferência do supervisor. */
export function MeusProntuariosPage() {
  const { prontuarios } = useProntuarios()
  const meus = prontuarios.filter((p) => p.atuanteId === atuanteLogado.id)
  const [filtro, setFiltro] = useState<FiltroProntuario>('todos')
  /** undefined = fechado; null = novo; Prontuario = abrir esse. */
  const [aberto, setAberto] = useState<Prontuario | null | undefined>(undefined)
  const [chaveModal, setChaveModal] = useState(0)

  const conta = (s: Prontuario['status']) => meus.filter((p) => p.status === s).length
  const devolvidos = conta('devolvido')
  const linhas = ordenar(filtro === 'todos' ? meus : meus.filter((p) => p.status === filtro))
  const abrir = (p: Prontuario | null) => {
    setChaveModal((k) => k + 1)
    setAberto(p)
  }

  return (
    <>
      <PageHeader
        titulo="Meus prontuários"
        subtitulo={`Um prontuário por sessão. ${atuanteLogado.supervisor} confere, valida ou devolve com comentário.`}
        acoes={
          <Button onClick={() => abrir(null)}>
            <IconAdicionar size={18} /> Registrar prontuário
          </Button>
        }
      />

      <div className="mb-5 space-y-3">
        {devolvidos > 0 && (
          <Alert tom="aviso" titulo={devolvidos === 1 ? '1 prontuário devolvido' : `${devolvidos} prontuários devolvidos`}>
            {atuanteLogado.supervisor} deixou comentários. Abra, corrija e reenvie.
          </Alert>
        )}
        <AvisoSigilo />
      </div>

      <Card
        titulo="Prontuários"
        descricao={`${conta('aguardando_supervisor')} aguardando supervisor · ${conta('rascunho')} em rascunho · ${conta('validado')} validados`}
        acoes={
          <SelectMenu
            ariaLabel="Filtrar por situação"
            tamanho="sm"
            className="w-60"
            value={filtro}
            onChange={setFiltro}
            opcoes={[
              { valor: 'todos', rotulo: `Todos (${meus.length})` },
              { valor: 'devolvido', rotulo: `Devolvidos (${devolvidos})`, tom: 'aviso' },
              { valor: 'rascunho', rotulo: `Rascunhos (${conta('rascunho')})` },
              { valor: 'aguardando_supervisor', rotulo: `Aguardando supervisor (${conta('aguardando_supervisor')})`, tom: 'info' },
              { valor: 'validado', rotulo: `Validados (${conta('validado')})`, tom: 'ok' },
            ]}
          />
        }
      >
        <DataTable
          chaveLinha={(p) => p.id}
          linhas={linhas}
          vazio="Nenhum prontuário nesta situação."
          colunas={[
            {
              chave: 'sessao',
              titulo: 'Sessão',
              render: (p) => (
                <button type="button" onClick={() => abrir(p)} className="text-left">
                  <span className="block font-medium text-slate-900 hover:text-sepa-700 hover:underline dark:text-slate-50 dark:hover:text-sepa-200">
                    {usuarios.find((u) => u.id === p.usuarioId)?.nome}
                  </span>
                  <span className="text-xs text-slate-500 tabular-nums dark:text-slate-400">
                    {dataBR(p.data)} · {p.modalidade}
                  </span>
                </button>
              ),
            },
            { chave: 'situacao', titulo: 'Situação', render: (p) => <StatusProntuarioBadge status={p.status} /> },
            {
              chave: 'comentario',
              titulo: 'Comentário do supervisor',
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
                <Button variante={p.status === 'devolvido' ? 'primario' : 'secundario'} tamanho="sm" onClick={() => abrir(p)}>
                  {p.status === 'devolvido' ? 'Corrigir' : p.status === 'rascunho' ? 'Continuar' : 'Ver'}
                </Button>
              ),
            },
          ]}
        />
      </Card>

      {aberto !== undefined && (
        <ProntuarioModal key={chaveModal} aberto onFechar={() => setAberto(undefined)} prontuario={aberto ?? undefined} />
      )}
    </>
  )
}
