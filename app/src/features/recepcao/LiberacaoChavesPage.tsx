import { useState } from 'react'
import { Card } from '../../components/ui/Card'
import { DataTable } from '../../components/ui/DataTable'
import { Input } from '../../components/ui/Field'
import { Icon, IconBuscar } from '../../components/ui/icons'
import { PageHeader } from '../../components/ui/PageHeader'
import { SelectMenu } from '../../components/ui/SelectMenu'
import { SituacaoSalaBadge } from '../../components/ui/StatusBadge'
import { cn } from '../../lib/cn'
import { nomeReferencia } from '../../lib/datas'
import type { SituacaoSala } from '../../types'
import { dataCurta, permissoesDaJanela, type PermissaoPessoa } from '../permissao/permissoes'
import { ORIENTACAO_RECEPCAO } from '../permissao/regraPermissao'

const { janela, pessoas } = permissoesDaJanela()

const semAcento = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

type Filtro = 'todos' | 'entrega' | 'nao_entrega'

/** Detalhe curto da situação, sem expor dados clínicos. */
function detalhe(p: PermissaoPessoa) {
  if (p.situacao === 'excecao' && p.excecao) return `Exceção válida até ${dataCurta(p.excecao.ate)}`
  if (p.situacao === 'liberado') return `Válido até ${dataCurta(janela.fim)}`
  if (p.situacao === 'bloqueado' && p.vencidas.length) return 'Declarar atendimentos na ficha (15 dias)'
  return p.situacao === 'aguardando' ? 'Procurar o supervisor de campo' : 'Procurar o Setor de Registro'
}

function Resultado({ p }: { p: PermissaoPessoa }) {
  const o = ORIENTACAO_RECEPCAO[p.situacao]
  const tom: Record<SituacaoSala, string> = {
    liberado: 'border-emerald-200 bg-emerald-50 dark:border-emerald-400/20 dark:bg-emerald-400/10',
    excecao: 'border-amber-200 bg-amber-50 dark:border-amber-400/20 dark:bg-amber-400/10',
    aguardando: 'border-sepa-200 bg-sepa-50 dark:border-sepa-300/30 dark:bg-sepa-400/15',
    bloqueado: 'border-red-200 bg-red-50 dark:border-red-400/20 dark:bg-red-400/10',
  }
  const corIcone: Record<SituacaoSala, string> = {
    liberado: 'bg-emerald-600 text-white dark:bg-emerald-400 dark:text-emerald-950',
    excecao: 'bg-amber-500 text-white dark:bg-amber-400 dark:text-amber-950',
    aguardando: 'bg-sepa-600 text-white dark:bg-sepa-300 dark:text-sepa-950',
    bloqueado: 'bg-red-600 text-white dark:bg-red-400 dark:text-red-950',
  }
  return (
    <li className={cn('flex items-center gap-4 rounded-xl border px-5 py-4', tom[p.situacao])}>
      <span className={cn('flex size-12 shrink-0 items-center justify-center rounded-full', corIcone[p.situacao])}>
        <Icon nome={o.entrega ? 'key' : 'key_off'} size={26} fill />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">{o.titulo}</p>
        <p className="text-sm text-slate-700 dark:text-slate-200">
          <strong className="font-semibold">{p.nome}</strong> · {p.vinculos.join(' · ')}
        </p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          {p.situacao === 'bloqueado' && p.vencidas.length
            ? 'Há atendimento sem declarar na ficha há mais de 15 dias. Oriente o aluno a declarar na ficha para liberar.'
            : o.texto}
          {p.situacao === 'excecao' && p.excecao && ` Válida até ${dataCurta(p.excecao.ate)}.`}
          {p.situacao === 'liberado' && ` Válido até ${dataCurta(janela.fim)}.`}
        </p>
      </div>
    </li>
  )
}

/**
 * Consulta da Recepção antes de entregar a chave — substitui a planilha de permissão.
 * Mostra só o necessário: nome, vínculo e se pode entregar. Nada de usuários atendidos ou conteúdo de ficha.
 */
export function LiberacaoChavesPage() {
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState<Filtro>('todos')

  const termo = semAcento(busca.trim())
  const encontrados = termo.length >= 2 ? pessoas.filter((p) => semAcento(p.nome).includes(termo)) : []

  const entrega = pessoas.filter((p) => ORIENTACAO_RECEPCAO[p.situacao].entrega)
  const linhas = filtro === 'todos' ? pessoas : filtro === 'entrega' ? entrega : pessoas.filter((p) => !ORIENTACAO_RECEPCAO[p.situacao].entrega)

  return (
    <>
      <PageHeader
        titulo="Liberação de chaves"
        subtitulo={`Janela ${dataCurta(janela.inicio)} → ${dataCurta(janela.fim)} · vale a ficha de ${nomeReferencia(janela.referenciaFicha)} validada pelo supervisor`}
      />

      <Card className="mb-6">
        <label htmlFor="busca-aluno" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
          Quem veio buscar a chave?
        </label>
        <div className="relative">
          <IconBuscar size={22} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
          <Input
            id="busca-aluno"
            autoFocus
            autoComplete="off"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Digite o nome do aluno"
            className="py-3 pl-11 text-base"
          />
        </div>

        {termo.length >= 2 && (
          <ul className="mt-4 space-y-3" aria-live="polite">
            {encontrados.length ? (
              encontrados.slice(0, 4).map((p) => <Resultado key={p.atuanteId} p={p} />)
            ) : (
              <li className="rounded-xl border border-dashed border-slate-300 px-5 py-4 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
                Ninguém com esse nome nesta janela. Se a pessoa atende no SEPA, oriente a procurar o Setor de Registro.
              </li>
            )}
          </ul>
        )}
      </Card>

      <Card
        titulo="Lista da janela"
        descricao="Situação de cada aluno para retirar chave e usar salas. A regra vale por pessoa: pendência em qualquer vínculo bloqueia tudo."
        acoes={
          <SelectMenu
            ariaLabel="Filtrar lista"
            tamanho="sm"
            className="w-56"
            value={filtro}
            onChange={setFiltro}
            opcoes={[
              { valor: 'todos', rotulo: `Todos (${pessoas.length})` },
              { valor: 'entrega', rotulo: `Podem retirar (${entrega.length})`, tom: 'ok' },
              { valor: 'nao_entrega', rotulo: `Não podem retirar (${pessoas.length - entrega.length})`, tom: 'aviso' },
            ]}
          />
        }
      >
        <DataTable
          chaveLinha={(p) => p.atuanteId}
          linhas={linhas}
          colunas={[
            { chave: 'nome', titulo: 'Aluno', render: (p) => <span className="font-medium text-slate-900 dark:text-slate-50">{p.nome}</span> },
            { chave: 'vinc', titulo: 'Vínculo', render: (p) => <span className="text-slate-600 dark:text-slate-300">{p.vinculos.join(' · ')}</span> },
            { chave: 'sit', titulo: 'Situação', render: (p) => <SituacaoSalaBadge situacao={p.situacao} /> },
            { chave: 'det', titulo: 'Orientação', render: (p) => <span className="text-sm text-slate-600 dark:text-slate-300">{detalhe(p)}</span> },
          ]}
        />
      </Card>
    </>
  )
}
