import { Button } from '../../../components/ui/Button'
import { IconAlertaErro, IconEnviar, IconOk, IconSalvar } from '../../../components/ui/icons'
import type { ErroFicha } from '../validarFicha'

interface Props {
  erros: ErroFicha[]
  supervisor: string
  onSalvar: () => void
  onEnviar: () => void
}

/** Rodapé fixo e enxuto: um resumo de uma linha + ações. Os detalhes dos erros ficam nas próprias linhas. */
export function RodapeEnvio({ erros, supervisor, onSalvar, onEnviar }: Props) {
  const geral = erros.find((e) => e.alvo === 'geral')
  const ok = erros.length === 0

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      {ok ? (
        <p className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
          <IconOk size={20} fill /> Tudo certo. Ao enviar, {supervisor} recebe a ficha para conferir.
        </p>
      ) : (
        <p className="flex items-center gap-2 text-sm font-medium text-red-700 dark:text-red-300">
          <IconAlertaErro size={20} fill />
          {geral ? geral.mensagem : `${erros.length} ${erros.length === 1 ? 'item para corrigir' : 'itens para corrigir'} — veja as linhas destacadas.`}
        </p>
      )}
      <div className="grid shrink-0 grid-cols-2 gap-2 sm:flex">
        <Button variante="secundario" onClick={onSalvar}>
          <IconSalvar size={18} /> <span className="sm:hidden">Salvar</span><span className="hidden sm:inline">Salvar rascunho</span>
        </Button>
        <Button onClick={onEnviar} disabled={!ok}>
          <IconEnviar size={18} /> <span className="sm:hidden">Enviar</span><span className="hidden sm:inline">Enviar para supervisora</span>
        </Button>
      </div>
    </div>
  )
}
