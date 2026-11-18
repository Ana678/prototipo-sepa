import type { FichaMensal } from '../../types'
import { diaMes, limitesDoMes } from '../../lib/datas'

export interface ErroFicha {
  /** id da linha com problema, ou 'geral' */
  alvo: string
  /** mensagem curta, exibida dentro da própria linha */
  mensagem: string
}

/**
 * Regras que hoje geram o ciclo de "retificação sem fim" por e-mail.
 * A ficha só pode ser enviada ao supervisor quando a lista volta vazia.
 */
export function validarFicha(ficha: FichaMensal, semAtendimentos: boolean, justificativa: string): ErroFicha[] {
  const erros: ErroFicha[] = []
  const { min, max } = limitesDoMes(ficha.referencia)

  if (semAtendimentos) {
    if (!justificativa.trim()) erros.push({ alvo: 'geral', mensagem: 'Explique por que não houve atendimentos no mês.' })
    return erros
  }

  if (ficha.sessoes.length === 0) {
    erros.push({ alvo: 'geral', mensagem: 'Adicione ao menos um usuário atendido ou marque que não houve atendimentos.' })
  }

  const vistos = new Set<string>()

  for (const linha of ficha.sessoes) {
    const add = (mensagem: string) => erros.push({ alvo: linha.id, mensagem })

    if (!linha.usuarioId) add('Selecione o usuário.')
    if (linha.datas.length === 0) add('Adicione as datas das sessões.')

    const fora = linha.datas.filter((d) => d < min || d > max)
    if (fora.length) add(`${fora.map(diaMes).join(', ')} não é deste mês.`)

    const repetidas = [...new Set(linha.datas.filter((d, i) => linha.datas.indexOf(d) !== i))]
    if (repetidas.length) add(`Data repetida: ${repetidas.map(diaMes).join(', ')}.`)

    if (linha.situacao === 'Encaminhado' && !linha.observacao.trim()) add('Informe para onde foi o encaminhamento.')

    const chave = `${linha.modalidade}|${linha.usuarioId}`
    if (linha.usuarioId && vistos.has(chave)) add('Usuário repetido nesta modalidade.')
    vistos.add(chave)
  }

  return erros
}
