/**
 * Dados FICTÍCIOS para o protótipo. Nenhum nome, CPF ou contato aqui pertence a pessoas reais.
 * Os totais do relatório usam como exemplo os números agregados publicados no Relatório de Gestão 2025.
 */
import type {
  AtividadeColetiva,
  Atuante,
  FichaMensal,
  Modalidade,
  SituacaoMes,
  StatusFicha,
  Usuario,
} from '../types'
import type { ExcecaoSupervisor } from '../features/permissao/regraPermissao'

/** "Hoje" fixo do protótipo, para os prazos ficarem coerentes. */
export const HOJE = '2026-11-18'

export const atuanteLogado: Atuante = {
  id: 'a1',
  nome: 'Beatriz Lima',
  vinculo: '5º ano',
  supervisor: 'Profa. Helena Duarte',
}

export const supervisorLogado = { nome: 'Profa. Helena Duarte' }

/** Supervisores de campo (fictícios). */
export const supervisores = ['Profa. Helena Duarte', 'Prof. Renato Sales', 'Profa. Sílvia Moura', 'Prof. Daniel Freitas']

export const usuarios: Usuario[] = [
  { id: 'u1', nome: 'Marcos A. Ferreira', cpf: '***.412.880-**', vinculoUFRN: 'Aluno', curso: 'Engenharia Civil', modalidades: ['Psicoterapia'], primeiroAtendimento: '2025-08-12', desfecho1: 'Em atendimento' },
  { id: 'u2', nome: 'Luana P. Costa', cpf: '***.031.554-**', vinculoUFRN: 'Externo', modalidades: ['Psicoterapia', 'Neuropsicologia'], primeiroAtendimento: '2026-03-10', desfecho1: 'Em atendimento', desfecho2: 'Encaminhado (interno)' },
  { id: 'u3', nome: 'Rafael T. Nunes', cpf: '***.778.120-**', vinculoUFRN: 'Externo', modalidades: ['Psicoterapia'], primeiroAtendimento: '2026-04-02', desfecho1: 'Em atendimento' },
  { id: 'u4', nome: 'Carla M. Rocha', cpf: '***.209.663-**', vinculoUFRN: 'Servidor', modalidades: ['Plantão Psicológico'], primeiroAtendimento: '2026-11-04', desfecho1: 'Lista de espera' },
  { id: 'u5', nome: 'Pedro H. Alves', cpf: '***.551.902-**', vinculoUFRN: 'Aluno', curso: 'Psicologia', modalidades: ['Psicoterapia'], primeiroAtendimento: '2024-10-21', desfecho1: 'Em atendimento' },
  { id: 'u6', nome: 'Joana S. Melo', cpf: '***.660.017-**', vinculoUFRN: 'Externo', modalidades: ['Psicopedagogia'], primeiroAtendimento: '2025-02-17', desfecho1: 'Encerrado / Alta' },
  { id: 'u7', nome: 'Tiago R. Barros', cpf: '***.384.245-**', vinculoUFRN: 'Terceirizado', modalidades: ['Psicoterapia', 'Grupo'], primeiroAtendimento: '2025-11-03', desfecho1: 'Em atendimento' },
  { id: 'u8', nome: 'Ana C. Dantas', cpf: '***.902.338-**', vinculoUFRN: 'Aluno', curso: 'Direito', modalidades: ['Psicoterapia'], primeiroAtendimento: '2026-05-06', desfecho1: 'Perda de vaga por faltas' },
]

/** Usuários atendidos pela atuante logada (aparecem no seletor da ficha). */
export const meusUsuariosIds = ['u1', 'u2', 'u3', 'u4', 'u8']

export const minhasFichas: { referencia: string; status: StatusFicha; enviadaEm?: string; sessoes: number; obs?: string }[] = [
  { referencia: '2026-11', status: 'rascunho', sessoes: 9 },
  { referencia: '2026-10', status: 'aguardando_supervisor', enviadaEm: '2026-11-04', sessoes: 14 },
  { referencia: '2026-09', status: 'validada', enviadaEm: '2026-10-03', sessoes: 15 },
  { referencia: '2026-08', status: 'devolvida', enviadaEm: '2026-09-05', sessoes: 12, obs: 'Sessão de 19/08 de Rafael T. Nunes não consta no SigSaúde. Corrigido e reenviado.' },
  { referencia: '2026-07', status: 'validada', enviadaEm: '2026-08-02', sessoes: 8 },
]

/** Rascunho da ficha de novembro, com um erro proposital para demonstrar a validação. */
export const rascunhoNovembro: FichaMensal = {
  id: 'f-2026-11',
  atuanteId: 'a1',
  referencia: '2026-11',
  status: 'rascunho',
  sessoes: [
    { id: 's1', modalidade: 'Psicoterapia', usuarioId: 'u1', datas: ['2026-11-03', '2026-11-10', '2026-11-17'], situacao: 'Segue em atendimento', observacao: '' },
    { id: 's2', modalidade: 'Psicoterapia', usuarioId: 'u2', datas: ['2026-11-05', '2026-11-12'], situacao: 'Segue em atendimento', observacao: '' },
    { id: 's3', modalidade: 'Psicoterapia', usuarioId: 'u3', datas: ['2026-10-29', '2026-11-13'], situacao: 'Segue em atendimento', observacao: '' },
    { id: 's5', modalidade: 'Psicoterapia', usuarioId: 'u8', datas: ['2026-11-06'], situacao: 'Perdeu a vaga por faltas', observacao: 'Faltou nos dias 13 e 20 sem justificativa.' },
    { id: 's4', modalidade: 'Plantão Psicológico', usuarioId: 'u4', datas: ['2026-11-04'], situacao: 'Iniciou neste mês', observacao: 'Primeiro contato; encaminhada à lista de espera.' },
  ],
}

export interface FichaParaValidar {
  id: string
  atuante: Atuante
  referencia: string
  enviadaEm: string
  linhas: { usuario: string; modalidade: Modalidade; datas: string[]; situacao: SituacaoMes; observacao?: string }[]
  /** Obrigatória quando a ficha vem sem atendimentos. */
  justificativa?: string
}

export const fichasParaValidar: FichaParaValidar[] = [
  {
    id: 'v1',
    atuante: atuanteLogado,
    referencia: '2026-10',
    enviadaEm: '2026-11-04',
    linhas: [
      { usuario: 'Marcos A. Ferreira', modalidade: 'Psicoterapia', datas: ['06/10', '13/10', '20/10', '27/10'], situacao: 'Segue em atendimento' },
      { usuario: 'Luana P. Costa', modalidade: 'Psicoterapia', datas: ['01/10', '08/10', '15/10', '22/10', '29/10'], situacao: 'Segue em atendimento' },
      { usuario: 'Rafael T. Nunes', modalidade: 'Psicoterapia', datas: ['02/10', '09/10', '16/10', '23/10', '30/10'], situacao: 'Iniciou neste mês' },
    ],
  },
  {
    id: 'v2',
    atuante: { id: 'a2', nome: 'Caio Medeiros', vinculo: '5º ano', supervisor: 'Profa. Helena Duarte' },
    referencia: '2026-10',
    enviadaEm: '2026-11-05',
    linhas: [
      { usuario: 'Pedro H. Alves', modalidade: 'Psicoterapia', datas: ['07/10', '14/10', '21/10', '28/10'], situacao: 'Segue em atendimento' },
      { usuario: 'Joana S. Melo', modalidade: 'Psicopedagogia', datas: ['03/10', '10/10'], situacao: 'Alta / encerramento', observacao: 'Objetivos do acompanhamento atingidos.' },
    ],
  },
  {
    id: 'v3',
    atuante: { id: 'a3', nome: 'Larissa Queiroz', vinculo: '4º ano', supervisor: 'Profa. Helena Duarte' },
    referencia: '2026-10',
    enviadaEm: '2026-11-02',
    linhas: [{ usuario: 'Carla M. Rocha', modalidade: 'Plantão Psicológico', datas: ['15/10', '22/10'], situacao: 'Encaminhado', observacao: 'Encaminhada para Psicoterapia (lista de espera).' }],
  },
  {
    // Caso regular sem chave: não atendeu, não retirou chave, enviou a ficha no prazo com justificativa.
    id: 'v4',
    atuante: { id: 'a11', nome: 'Tânia Coelho', vinculo: '4º ano', supervisor: 'Profa. Helena Duarte' },
    referencia: '2026-10',
    enviadaEm: '2026-11-03',
    linhas: [],
    justificativa: 'Sem atendimentos em outubro: aguardando novos encaminhamentos do plantão. Participei das supervisões semanais.',
  },
]

/** Uma linha por FICHA (pessoa + vínculo). Quem tem dois vínculos aparece duas vezes. */
export interface LinhaPainel {
  atuante: Atuante
  status: StatusFicha | 'nao_enviada'
  enviadaEm?: string
  /** Datas (dd/mm) com atendimento lançado na ficha — enviada ou em rascunho. */
  datasFicha?: string[]
  /** Sessões lançadas (útil quando a ficha ainda está em rascunho). */
  sessoes?: number
  /** Pedido do supervisor para não bloquear apesar da pendência. */
  excecao?: ExcecaoSupervisor
  observacao?: string
}

const datasDe = (id: string) => [...new Set(fichasParaValidar.find((f) => f.atuante.id === id)?.linhas.flatMap((l) => l.datas) ?? [])]

const livia = { id: 'a9', nome: 'Lívia Torres', supervisor: 'Profa. Sílvia Moura' }

export const painelOutubro: LinhaPainel[] = [
  { atuante: atuanteLogado, status: 'aguardando_supervisor', enviadaEm: '04/11', datasFicha: datasDe('a1'), sessoes: 14 },
  { atuante: { id: 'a2', nome: 'Caio Medeiros', vinculo: '5º ano', supervisor: 'Profa. Helena Duarte' }, status: 'aguardando_supervisor', enviadaEm: '05/11', datasFicha: datasDe('a2'), sessoes: 6 },
  { atuante: { id: 'a3', nome: 'Larissa Queiroz', vinculo: '4º ano', supervisor: 'Profa. Helena Duarte' }, status: 'aguardando_supervisor', enviadaEm: '02/11', datasFicha: datasDe('a3'), sessoes: 2 },
  { atuante: { id: 'a4', nome: 'Gustavo Pires', vinculo: '4º ano', supervisor: 'Profa. Helena Duarte' }, status: 'nao_enviada' },
  {
    atuante: { id: 'a5', nome: 'Isabela Freire', vinculo: 'Extensão', supervisor: 'Prof. Renato Sales', projeto: 'Projeto Acolher' },
    status: 'devolvida',
    enviadaEm: '03/11',
    datasFicha: ['07/10', '14/10', '21/10'],
    sessoes: 6,
    excecao: { ate: '2026-11-20', motivo: 'Correção combinada com o supervisor até 20/11.' },
    observacao: 'Supervisor pediu para não bloquear: correção combinada até 20/11.',
  },
  { atuante: { id: 'a6', nome: 'Mateus Araújo', vinculo: 'Técnico', supervisor: '—' }, status: 'validada', enviadaEm: '01/11', datasFicha: ['05/10', '19/10'], sessoes: 4 },
  {
    atuante: { id: 'a7', nome: 'Renata Vasconcelos', vinculo: '5º ano', supervisor: 'Profa. Helena Duarte' },
    status: 'rascunho',
    datasFicha: ['02/10', '06/10', '09/10', '13/10', '16/10', '20/10', '23/10'],
    sessoes: 9,
  },
  { atuante: { id: 'a8', nome: 'Felipe Cardoso', vinculo: 'Extensão', supervisor: 'Profa. Sílvia Moura', projeto: 'Grupo Enfrentamento à Timidez' }, status: 'validada', enviadaEm: '05/11', datasFicha: ['01/10', '08/10', '15/10', '22/10', '29/10'], sessoes: 5 },
  { atuante: { ...livia, vinculo: '4º ano' }, status: 'validada', enviadaEm: '03/11', datasFicha: ['06/10', '20/10'], sessoes: 4 },
  {
    atuante: { ...livia, vinculo: 'Extensão', supervisor: 'Prof. Renato Sales', projeto: 'Projeto Acolher' },
    status: 'devolvida',
    enviadaEm: '04/11',
    datasFicha: ['09/10', '23/10'],
    sessoes: 2,
    observacao: 'Duplo vínculo: a pendência na extensão bloqueia também o estágio.',
  },
  { atuante: { id: 'a11', nome: 'Tânia Coelho', vinculo: '4º ano', supervisor: 'Profa. Helena Duarte' }, status: 'aguardando_supervisor', enviadaEm: '03/11', datasFicha: [], sessoes: 0 },
  {
    atuante: { id: 'a10', nome: 'Otávio Rezende', vinculo: '5º ano', supervisor: 'Profa. Helena Duarte' },
    status: 'nao_enviada',
    observacao: 'Não retirou chave em outubro: ficha pendente, mas sem bloqueio.',
  },
]

/**
 * Retiradas de chave — VIRIAM DO MÓDULO DE RESERVA DE SALAS (outro grupo).
 * Só pessoa, data e sala: nada de usuário atendido. Dados fictícios.
 */
export interface UsoSala {
  atuanteId: string
  data: string // ISO yyyy-mm-dd
  sala: string
}

const usos = (atuanteId: string, sala: string, dias: string[]): UsoSala[] =>
  dias.map((d) => ({ atuanteId, sala, data: `2026-${d.slice(3, 5)}-${d.slice(0, 2)}` }))

export const usosDeSala: UsoSala[] = [
  // Beatriz: tudo declarado, exceto 14/11 (ainda dentro dos 15 dias)
  ...usos('a1', 'Sala 3', ['01/10', '06/10', '08/10', '13/10', '20/10', '27/10', '03/11', '05/11', '10/11', '12/11', '13/11', '14/11', '17/11']),
  // Caio: outubro ok; 10/11 sem declarar (bloqueia em 25/11)
  ...usos('a2', 'Sala 5', ['07/10', '14/10', '21/10', '28/10', '04/11', '10/11']),
  // Larissa: declarou 15 e 22/10, mas não 08 e 29/10 → passou de 15 dias, bloqueio automático
  ...usos('a3', 'Acolhimento 1', ['08/10', '15/10', '22/10', '29/10']),
  ...usos('a4', 'Sala 2', ['07/10', '14/10', '21/10', '28/10']),
  ...usos('a5', 'Ludoterapia 1', ['07/10', '14/10', '21/10']),
  ...usos('a6', 'Sala 7', ['05/10', '19/10', '02/11', '16/11']),
  ...usos('a7', 'Sala 4', ['02/10', '09/10', '16/10', '27/10']),
  ...usos('a8', 'Sala de grupo', ['01/10', '08/10', '15/10', '22/10', '29/10', '05/11', '12/11']),
  ...usos('a9', 'Sala 6', ['06/10', '09/10', '20/10']),
]

/** Datas já declaradas na ficha de NOVEMBRO (rascunho em andamento), por pessoa. */
export const declaradasNovembro: Record<string, string[]> = {
  a1: [...new Set(rascunhoNovembro.sessoes.flatMap((s) => s.datas))],
  a2: ['2026-11-04', '2026-11-10'],
  a6: ['2026-11-02', '2026-11-16'],
  a8: ['2026-11-05', '2026-11-12'],
}

/** Pendência que impede o Nada Consta. `ficha` é resolvida dentro da plataforma; `sigsaude` fica fora dela. */
export type Pendencia =
  | { tipo: 'ficha'; atuanteId: string; referencia: string; situacao: 'rascunho' | 'nao_enviada' | 'devolvida' }
  | { tipo: 'sigsaude'; descricao: string; ondeProcurar: string }

export interface HistoricoNadaConsta {
  atuanteId: string
  nome: string
  matricula: string
  anos: { ano: number; vinculo: string; pendencias: Pendencia[] }[]
  inseridoSIPAC: boolean
}

export const historicoNadaConsta: HistoricoNadaConsta[] = [
  {
    atuanteId: 'a1',
    nome: 'Beatriz Lima',
    matricula: '2021******',
    inseridoSIPAC: false,
    anos: [
      { ano: 2025, vinculo: '4º ano', pendencias: [] },
      { ano: 2026, vinculo: '5º ano', pendencias: [{ tipo: 'ficha', atuanteId: 'a1', referencia: '2026-11', situacao: 'rascunho' }] },
    ],
  },
  {
    atuanteId: 'a2',
    nome: 'Caio Medeiros',
    matricula: '2021******',
    inseridoSIPAC: true,
    anos: [
      { ano: 2024, vinculo: 'Extensão — Projeto Acolher', pendencias: [] },
      { ano: 2025, vinculo: '4º ano', pendencias: [] },
      { ano: 2026, vinculo: '5º ano', pendencias: [] },
    ],
  },
  {
    atuanteId: 'a4',
    nome: 'Gustavo Pires',
    matricula: '2022******',
    inseridoSIPAC: false,
    anos: [
      {
        ano: 2025,
        vinculo: 'Extensão — Interações',
        pendencias: [{ tipo: 'sigsaude', descricao: 'Prontuário não finalizado', ondeProcurar: 'Prontuário do atendimento de 12/06/2025 (Psicoterapia)' }],
      },
      {
        ano: 2026,
        vinculo: '4º ano',
        pendencias: [
          { tipo: 'ficha', atuanteId: 'a4', referencia: '2026-09', situacao: 'devolvida' },
          { tipo: 'ficha', atuanteId: 'a4', referencia: '2026-10', situacao: 'nao_enviada' },
        ],
      },
    ],
  },
]

/* ---------- Ficha vista pelo Registro (aberta a partir do Nada Consta ou do Painel) ---------- */

export interface EventoFicha {
  data: string
  texto: string
  detalhe?: string
}

export interface FichaRegistro {
  atuanteId: string
  referencia: string
  status: 'rascunho' | 'aguardando_supervisor' | 'validada' | 'devolvida' | 'atrasada' | 'nao_enviada'
  sessoes: number
  usuarios: number
  eventos: EventoFicha[]
}

const fichasRegistro: FichaRegistro[] = [
  {
    atuanteId: 'a1', referencia: '2026-11', status: 'rascunho', sessoes: 9, usuarios: 5,
    eventos: [{ data: '2026-11-03', texto: 'Ficha iniciada (rascunho)' }, { data: '2026-11-17', texto: 'Última edição do rascunho' }],
  },
  {
    atuanteId: 'a4', referencia: '2026-09', status: 'devolvida', sessoes: 11, usuarios: 4,
    eventos: [
      { data: '2026-10-05', texto: 'Enviada ao supervisor' },
      { data: '2026-10-08', texto: 'Devolvida pelo supervisor', detalhe: 'Sessões de 15/09 e 22/09 não constam no SigSaúde.' },
    ],
  },
  { atuanteId: 'a4', referencia: '2026-10', status: 'nao_enviada', sessoes: 0, usuarios: 0, eventos: [{ data: '2026-11-03', texto: 'Lembrete automático enviado' }] },
]

const ATUANTES_EXTRAS: Atuante[] = painelOutubro.map((l) => l.atuante)

export function obterFichaRegistro(atuanteId: string, referencia: string): { ficha: FichaRegistro; atuante: Atuante } | null {
  const atuante = ATUANTES_EXTRAS.find((a) => a.id === atuanteId)
  if (!atuante) return null
  const ficha = fichasRegistro.find((f) => f.atuanteId === atuanteId && f.referencia === referencia)
  if (ficha) return { ficha, atuante }
  // fichas de outubro sem histórico detalhado: monta a partir do painel
  const linha = painelOutubro.find((l) => l.atuante.id === atuanteId)
  if (!linha || referencia !== '2026-10') return null
  return {
    atuante,
    ficha: {
      atuanteId, referencia, status: linha.status, sessoes: linha.sessoes ?? 0, usuarios: linha.sessoes ? 4 : 0,
      eventos: linha.enviadaEm ? [{ data: `2026-11-${linha.enviadaEm.slice(0, 2)}`, texto: 'Enviada ao supervisor' }] : [],
    },
  }
}

export const atividades: AtividadeColetiva[] = [
  { id: 'at1', data: '2026-11-12', titulo: 'Reunião ordinária da equipe', categoria: 'Atividade Interna do Serviço', participacoes: 18, noEspacoSEPA: true },
  { id: 'at2', data: '2026-11-11', titulo: 'Supervisão de estágio — 5º ano', categoria: 'Supervisão de Estágio', supervisor: 'Profa. Helena Duarte', participacoes: 7, noEspacoSEPA: true },
  { id: 'at3', data: '2026-11-10', titulo: 'Grupo Enfrentamento à Timidez — encontro 6', categoria: 'Grupo', projeto: 'Grupo Enfrentamento à Timidez', participacoes: 9, noEspacoSEPA: true },
  { id: 'at4', data: '2026-11-07', titulo: 'Roda de conversa em escola municipal', categoria: 'Projeto Interações (fora do SEPA)', projeto: 'Interações-Psi', participacoes: 42, noEspacoSEPA: false },
  { id: 'at5', data: '2026-11-05', titulo: 'Formação do Projeto Acolher', categoria: 'Ações Formativas', projeto: 'Projeto Acolher', participacoes: 14, noEspacoSEPA: true },
]

/* ---------- Relatórios (exemplo baseado nos totais do Relatório de Gestão 2025) ---------- */

