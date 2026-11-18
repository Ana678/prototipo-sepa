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
    <div className="flex items-center justify-between gap-4">
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
      <div className="flex shrink-0 gap-2">
        <Button variante="secundario" onClick={onSalvar}>
          <IconSalvar size={18} /> Salvar rascunho
        </Button>
        <Button onClick={onEnviar} disabled={!ok}>
          <IconEnviar size={18} /> Enviar para supervisora
        </Button>
      </div>
    </div>
  )
}
