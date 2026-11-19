import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { DataTable } from '../../components/ui/DataTable'
import { IconNotificar } from '../../components/ui/icons'
import { PageHeader } from '../../components/ui/PageHeader'
import { SelectMenu } from '../../components/ui/SelectMenu'
import { StatTile } from '../../components/ui/StatTile'
import { Badge, SituacaoSalaBadge, StatusFichaBadge } from '../../components/ui/StatusBadge'
import { useToast } from '../../context/ToastContext'
import { painelOutubro, type LinhaPainel } from '../../data/mock'
import { dataCurta, permissoesDaJanela } from '../permissao/permissoes'
import { ORIENTACAO_RECEPCAO } from '../permissao/regraPermissao'
import { semEnvio } from './cruzamentoUsoSala'

const { janela, pessoas } = permissoesDaJanela()
const salaPorPessoa = new Map(pessoas.map((p) => [p.atuanteId, p.situacao]))
const autoPorPessoa = new Set(pessoas.filter((p) => p.vencidas.length).map((p) => p.atuanteId))

const naoIniciadas = painelOutubro.filter((l) => l.status === 'nao_enviada')
const rascunhos = painelOutubro.filter((l) => semEnvio(l) && l.status !== 'nao_enviada')

type Filtro = 'todos' | 'sem_envio' | '4º ano' | '5º ano' | 'Extensão' | 'Técnico'

function passa(l: LinhaPainel, f: Filtro) {
  if (f === 'todos') return true
  if (f === 'sem_envio') return semEnvio(l)
  return l.atuante.vinculo === f
}

/** Situação de envio com o detalhe que interessa ao Registro: não iniciou × parou no rascunho. */
function Envio({ l }: { l: LinhaPainel }) {
  if (l.status === 'nao_enviada')
    return (
      <>
        <Badge tom="erro">Não iniciada</Badge>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Nenhum atendimento lançado</p>
      </>
    )
  if (semEnvio(l))
    return (
      <>
        <Badge tom="erro">Rascunho não enviado</Badge>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{l.sessoes ?? 0} sessões lançadas, falta enviar</p>
      </>
    )
  return (
    <>
      <StatusFichaBadge status={l.status} />
      {l.enviadaEm && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Enviada em {l.enviadaEm}</p>}
    </>
  )
}

/** Substitui os "verdinhos e vermelhinhos" da planilha e a planilha de permissão de salas. */
export function PainelMesPage() {
  const toast = useToast()
  const [filtro, setFiltro] = useState<Filtro>('todos')

  const linhas = painelOutubro.filter((l) => passa(l, filtro))
  const enviadas = painelOutubro.filter((l) => l.enviadaEm).length
  const validadas = painelOutubro.filter((l) => l.status === 'validada').length
  const semChave = pessoas.filter((p) => !ORIENTACAO_RECEPCAO[p.situacao].entrega).length
  const pendentes = naoIniciadas.length + rascunhos.length

  function cobrar() {
    const partes = [
      naoIniciadas.length && `${naoIniciadas.length} sem ficha iniciada`,
      rascunhos.length && `${rascunhos.length} com rascunho não enviado`,
    ].filter(Boolean)
    toast(`Lembretes enviados: ${partes.join(' e ')}.`)
  }

  return (
    <>
      <PageHeader
        titulo="Painel do mês"
        subtitulo={`Fichas de outubro/2026 · prazo encerrado em 05/11 · janela de salas ${dataCurta(janela.inicio)} → ${dataCurta(janela.fim)}`}
        acoes={
          <Button onClick={cobrar} disabled={!pendentes}>
            <IconNotificar size={18} /> Cobrar pendentes ({pendentes})
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile rotulo="Fichas esperadas" valor={painelOutubro.length} />
        <StatTile
          rotulo="Enviadas"
          valor={enviadas}
          detalhe={`${naoIniciadas.length} não iniciada(s) · ${rascunhos.length} em rascunho`}
        />
        <StatTile rotulo="Validadas pelo supervisor" valor={validadas} />
        <StatTile rotulo="Sem liberação de salas" valor={semChave} detalhe={`de ${pessoas.length} pessoas · visto pela Recepção`} />
      </div>

      <Card
        titulo="Situação por atuante"
        acoes={
          <SelectMenu
            ariaLabel="Filtrar"
            tamanho="sm"
            className="w-64"
            value={filtro}
            onChange={setFiltro}
            opcoes={[
              { valor: 'todos', rotulo: 'Todas as fichas' },
              { valor: 'sem_envio', rotulo: `Sem envio (${pendentes})`, descricao: 'Não iniciadas ou paradas em rascunho' },
              { valor: '4º ano', rotulo: '4º ano' },
              { valor: '5º ano', rotulo: '5º ano' },
              { valor: 'Extensão', rotulo: 'Extensão' },
              { valor: 'Técnico', rotulo: 'Técnico' },
            ]}
          />
        }
      >
        <DataTable
          chaveLinha={(l) => `${l.atuante.id}-${l.atuante.vinculo}`}
          linhas={linhas}
          colunas={[
            {
              chave: 'nome',
              titulo: 'Atuante',
              render: (l) => (
                <>
                  <Link
                    to={`/registro/fichas/${l.atuante.id}/2026-10`}
                    className="font-medium text-slate-900 hover:text-sepa-700 hover:underline dark:text-slate-50 dark:hover:text-sepa-200"
                  >
                    {l.atuante.nome}
                  </Link>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {l.atuante.projeto ? `${l.atuante.vinculo} · ${l.atuante.projeto}` : l.atuante.vinculo} · {l.atuante.supervisor}
                  </p>
                </>
              ),
            },
            { chave: 'ficha', titulo: 'Ficha', render: (l) => <Envio l={l} /> },
            {
              chave: 'sala',
              titulo: 'Salas',
              render: (l) => (
                <>
                  <SituacaoSalaBadge situacao={salaPorPessoa.get(l.atuante.id) ?? 'bloqueado'} />
                  {autoPorPessoa.has(l.atuante.id) && <p className="mt-1 text-xs text-red-700 dark:text-red-300">Automático: 15 dias sem declarar</p>}
                </>
              ),
            },
            { chave: 'obs', titulo: 'Observação', render: (l) => <span className="text-xs text-slate-600 dark:text-slate-300">{l.observacao ?? ''}</span> },
          ]}
        />
      </Card>
    </>
  )
}
