import { Link } from 'react-router-dom'
import { IconAbrir, IconExterno, IconFichas, Icon } from '../../components/ui/icons'
import { LINKS_EXTERNOS } from '../../config/linksExternos'
import type { Pendencia } from '../../data/mock'
import { nomeReferencia } from '../../lib/datas'

const SITUACAO_FICHA = { rascunho: 'Em rascunho, não enviada', nao_enviada: 'Não enviada', devolvida: 'Devolvida para correção' }

const linkClasse =
  'inline-flex shrink-0 items-center gap-1 rounded-md px-2.5 py-1.5 text-sm font-medium text-sepa-700 hover:bg-sepa-50 dark:text-sepa-200 dark:hover:bg-sepa-400/15'

/** Uma pendência do Nada Consta: dentro da plataforma vira link interno; fora dela, link externo em nova aba. */
export function PendenciaItem({ pendencia }: { pendencia: Pendencia }) {
  if (pendencia.tipo === 'ficha') {
    return (
      <li className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50/60 px-3 py-2.5 dark:border-red-400/20 dark:bg-red-400/10">
        <IconFichas size={20} className="text-red-600 dark:text-red-300" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-900 first-letter:uppercase dark:text-slate-50">Ficha de {nomeReferencia(pendencia.referencia)}</p>
          <p className="text-xs text-red-700 dark:text-red-300">{SITUACAO_FICHA[pendencia.situacao]}</p>
        </div>
        <Link to={`/registro/fichas/${pendencia.atuanteId}/${pendencia.referencia}`} className={linkClasse}>
          Abrir ficha <IconAbrir size={16} />
        </Link>
      </li>
    )
  }

  const { nome, url } = LINKS_EXTERNOS.sigsaude
  return (
    <li className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50/60 px-3 py-2.5 dark:border-red-400/20 dark:bg-red-400/10">
      <Icon nome="medical_information" size={20} className="text-red-600 dark:text-red-300" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
          {pendencia.descricao} <span className="font-normal text-slate-500 dark:text-slate-400">· no {nome}</span>
        </p>
        <p className="text-xs text-red-700 dark:text-red-300">Procure: {pendencia.ondeProcurar}</p>
      </div>
      <a href={url} target="_blank" rel="noopener noreferrer" className={linkClasse} title={`Abre o ${nome} em nova aba`}>
        Abrir no {nome} <IconExterno size={16} />
        <span className="sr-only">(abre em nova aba)</span>
      </a>
    </li>
  )
}
