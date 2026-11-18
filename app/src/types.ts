export type Perfil = 'atuante' | 'supervisor' | 'registro' | 'gestao'

export type VinculoAtuante = '4º ano' | '5º ano' | 'Extensão' | 'Pós-graduação' | 'Técnico'

export type VinculoUFRN = 'Externo' | 'Aluno' | 'Servidor' | 'Terceirizado' | 'Não identificado'

export const MODALIDADES = [
  'Plantão Psicológico',
  'Psicoterapia',
  'Neuropsicologia',
  'Atenção Psicológica',
  'Psicopedagogia',
  'Grupo',
  'Outra',
] as const
export type Modalidade = (typeof MODALIDADES)[number]

export type StatusFicha =
  | 'rascunho'
  | 'aguardando_supervisor'
  | 'validada'
  | 'devolvida'
  | 'atrasada'

/** Situação do atuante para uso de salas na janela dia 15 → dia 15 (dado consumido pelo módulo de Reserva de Salas). */
export type SituacaoSala = 'liberado' | 'bloqueado' | 'excecao'

export const DESFECHOS = [
  'Em atendimento',
  'Desistência',
  'Perda de vaga por faltas',
  'Encerrado / Alta',
  'Encaminhado (interno)',
  'Encaminhado (externo)',
  'Lista de espera',
  'Suspenso',
  'Segue no próximo ano',
] as const
export type Desfecho = (typeof DESFECHOS)[number]

export interface Atuante {
  id: string
  nome: string
  vinculo: VinculoAtuante
  supervisor: string
  projeto?: string
}

export interface Usuario {
  id: string
  nome: string
  cpf: string
  vinculoUFRN: VinculoUFRN
  curso?: string
  modalidades: Modalidade[]
  /** ISO date do primeiro atendimento — base da regra de 1 ano (+1). */
  primeiroAtendimento: string
  desfecho1: Desfecho
  desfecho2?: Desfecho
}

/**
 * Situação do usuário no mês — substitui a seção "Movimentação de usuários" da ficha em Word
 * (início, desistência, perda de vaga, alta, encaminhamento), agora marcada na própria linha do usuário.
 */
export const SITUACOES_MES = [
  'Segue em atendimento',
  'Iniciou neste mês',
  'Desistiu',
  'Perdeu a vaga por faltas',
  'Alta / encerramento',
  'Encaminhado',
] as const
export type SituacaoMes = (typeof SITUACOES_MES)[number]

export interface LinhaSessao {
  id: string
  modalidade: Modalidade
  usuarioId: string
  /** ISO dates (AAAA-MM-DD) */
  datas: string[]
  situacao: SituacaoMes
  observacao: string
}

export interface FichaMensal {
  id: string
  atuanteId: string
  /** AAAA-MM */
  referencia: string
  status: StatusFicha
  enviadaEm?: string
  sessoes: LinhaSessao[]
  pendenciaSupervisor?: string
  naoBloquear?: boolean
}

export type CategoriaAtividade =
  | 'Atividade Interna do Serviço'
  | 'Ações Formativas'
  | 'Supervisão de Estágio'
  | 'Grupo'
  | 'Ações de Promoção em Saúde'
  | 'Projeto Interações (fora do SEPA)'

export interface AtividadeColetiva {
  id: string
  data: string
  titulo: string
  categoria: CategoriaAtividade
  projeto?: string
  participacoes: number
  noEspacoSEPA: boolean
}
