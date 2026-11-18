/**
 * Dados FICTÍCIOS para o protótipo. Nenhum nome, CPF ou contato aqui pertence a pessoas reais.
 * Os totais do relatório usam como exemplo os números agregados publicados no Relatório de Gestão 2025.
 */
import type {
  AtividadeColetiva,
  Atuante,
  FichaMensal,
  Modalidade,
  SituacaoSala,
  StatusFicha,
  Usuario,
  VinculoUFRN,
} from '../types'

/** "Hoje" fixo do protótipo, para os prazos ficarem coerentes. */
export const HOJE = '2026-11-18'

export const atuanteLogado: Atuante = {
  id: 'a1',
  nome: 'Beatriz Lima',
  vinculo: '5º ano',
  supervisor: 'Profa. Helena Duarte',
}

export const supervisorLogado = { nome: 'Profa. Helena Duarte' }

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
  linhas: { usuario: string; modalidade: Modalidade; datas: string[] }[]
  movimentacoes: string[]
}

export const fichasParaValidar: FichaParaValidar[] = [
  {
    id: 'v1',
    atuante: atuanteLogado,
    referencia: '2026-10',
    enviadaEm: '2026-11-04',
    movimentacoes: ['Início de atendimento: Rafael T. Nunes'],
    linhas: [
      { usuario: 'Marcos A. Ferreira', modalidade: 'Psicoterapia', datas: ['06/10', '13/10', '20/10', '27/10'] },
      { usuario: 'Luana P. Costa', modalidade: 'Psicoterapia', datas: ['01/10', '08/10', '15/10', '22/10', '29/10'] },
      { usuario: 'Rafael T. Nunes', modalidade: 'Psicoterapia', datas: ['02/10', '09/10', '16/10', '23/10', '30/10'] },
    ],
  },
  {
    id: 'v2',
    atuante: { id: 'a2', nome: 'Caio Medeiros', vinculo: '5º ano', supervisor: 'Profa. Helena Duarte' },
    referencia: '2026-10',
    enviadaEm: '2026-11-05',
    movimentacoes: ['Encerramento / Alta: Joana S. Melo'],
    linhas: [
      { usuario: 'Pedro H. Alves', modalidade: 'Psicoterapia', datas: ['07/10', '14/10', '21/10', '28/10'] },
      { usuario: 'Joana S. Melo', modalidade: 'Psicopedagogia', datas: ['03/10', '10/10'] },
    ],
  },
  {
    id: 'v3',
    atuante: { id: 'a3', nome: 'Larissa Queiroz', vinculo: '4º ano', supervisor: 'Profa. Helena Duarte' },
    referencia: '2026-10',
    enviadaEm: '2026-11-02',
    movimentacoes: [],
    linhas: [{ usuario: 'Carla M. Rocha', modalidade: 'Plantão Psicológico', datas: ['15/10', '22/10'] }],
  },
]

export interface LinhaPainel {
  atuante: Atuante
  status: StatusFicha | 'nao_enviada'
  enviadaEm?: string
  sala: SituacaoSala
  observacao?: string
}

export const painelOutubro: LinhaPainel[] = [
  { atuante: atuanteLogado, status: 'aguardando_supervisor', enviadaEm: '04/11', sala: 'liberado' },
  { atuante: { id: 'a2', nome: 'Caio Medeiros', vinculo: '5º ano', supervisor: 'Profa. Helena Duarte' }, status: 'aguardando_supervisor', enviadaEm: '05/11', sala: 'liberado' },
  { atuante: { id: 'a3', nome: 'Larissa Queiroz', vinculo: '4º ano', supervisor: 'Profa. Helena Duarte' }, status: 'validada', enviadaEm: '02/11', sala: 'liberado' },
  { atuante: { id: 'a4', nome: 'Gustavo Pires', vinculo: '4º ano', supervisor: 'Prof. Renato Sales' }, status: 'nao_enviada', sala: 'bloqueado' },
  { atuante: { id: 'a5', nome: 'Isabela Freire', vinculo: 'Extensão', supervisor: 'Prof. Renato Sales', projeto: 'Projeto Acolher' }, status: 'devolvida', enviadaEm: '03/11', sala: 'excecao', observacao: 'Supervisor pediu para não bloquear: correção combinada até 20/11.' },
  { atuante: { id: 'a6', nome: 'Mateus Araújo', vinculo: 'Técnico', supervisor: '—' }, status: 'validada', enviadaEm: '01/11', sala: 'liberado' },
  { atuante: { id: 'a7', nome: 'Renata Vasconcelos', vinculo: '5º ano', supervisor: 'Profa. Sílvia Moura' }, status: 'atrasada', sala: 'bloqueado' },
  { atuante: { id: 'a8', nome: 'Felipe Cardoso', vinculo: 'Extensão', supervisor: 'Profa. Sílvia Moura', projeto: 'Grupo Enfrentamento à Timidez' }, status: 'validada', enviadaEm: '05/11', sala: 'liberado' },
]

export interface HistoricoNadaConsta {
  nome: string
  matricula: string
  anos: { ano: number; vinculo: string; fichasPendentes: number; sigSaudePendente: boolean; obs?: string }[]
  inseridoSIPAC: boolean
}

export const historicoNadaConsta: HistoricoNadaConsta[] = [
  {
    nome: 'Beatriz Lima',
    matricula: '2021******',
    inseridoSIPAC: false,
    anos: [
      { ano: 2025, vinculo: '4º ano', fichasPendentes: 0, sigSaudePendente: false },
      { ano: 2026, vinculo: '5º ano', fichasPendentes: 1, sigSaudePendente: false, obs: 'Ficha de novembro ainda em rascunho.' },
    ],
  },
  {
    nome: 'Caio Medeiros',
    matricula: '2021******',
    inseridoSIPAC: true,
    anos: [
      { ano: 2024, vinculo: 'Extensão — Projeto Acolher', fichasPendentes: 0, sigSaudePendente: false },
      { ano: 2025, vinculo: '4º ano', fichasPendentes: 0, sigSaudePendente: false },
      { ano: 2026, vinculo: '5º ano', fichasPendentes: 0, sigSaudePendente: false },
    ],
  },
  {
    nome: 'Gustavo Pires',
    matricula: '2022******',
    inseridoSIPAC: false,
    anos: [
      { ano: 2025, vinculo: 'Extensão — Interações', fichasPendentes: 0, sigSaudePendente: true, obs: 'Prontuário de 12/06/2025 não finalizado no SigSaúde.' },
      { ano: 2026, vinculo: '4º ano', fichasPendentes: 2, sigSaudePendente: false },
    ],
  },
]

export const atividades: AtividadeColetiva[] = [
  { id: 'at1', data: '2026-11-12', titulo: 'Reunião ordinária da equipe', categoria: 'Atividade Interna do Serviço', participacoes: 18, noEspacoSEPA: true },
  { id: 'at2', data: '2026-11-11', titulo: 'Supervisão de estágio — 5º ano', categoria: 'Supervisão de Estágio', participacoes: 7, noEspacoSEPA: true },
  { id: 'at3', data: '2026-11-10', titulo: 'Grupo Enfrentamento à Timidez — encontro 6', categoria: 'Grupo', projeto: 'Grupo Enfrentamento à Timidez', participacoes: 9, noEspacoSEPA: true },
  { id: 'at4', data: '2026-11-07', titulo: 'Roda de conversa em escola municipal', categoria: 'Projeto Interações (fora do SEPA)', projeto: 'Interações-Psi', participacoes: 42, noEspacoSEPA: false },
  { id: 'at5', data: '2026-11-05', titulo: 'Formação do Projeto Acolher', categoria: 'Ações Formativas', projeto: 'Projeto Acolher', participacoes: 14, noEspacoSEPA: true },
]

/* ---------- Relatórios (exemplo baseado nos totais do Relatório de Gestão 2025) ---------- */

export const relatorio = {
  ano: 2025,
  usuariosUnicos: 394,
  atendimentos: 4220,
  atividadesColetivas: 309,
  participacoes: 2075,
  porQtdModalidades: [
    { rotulo: 'Em 1 modalidade', valor: 366 },
    { rotulo: 'Em 2 modalidades', valor: 25 },
    { rotulo: 'Em 3 modalidades', valor: 3 },
  ],
  atendimentosPorModalidade: [
    { rotulo: 'Psicoterapia', valor: 3030 },
    { rotulo: 'Neuropsicologia', valor: 420 },
    { rotulo: 'Acolhimento', valor: 310 },
    { rotulo: 'Psicopedagogia', valor: 260 },
    { rotulo: 'Grupo', valor: 200 },
  ],
  usuariosPorModalidadeVinculo: [
    { modalidade: 'Acolhimento', valores: { Externo: 80, Aluno: 39, Servidor: 3, Terceirizado: 2, 'Não identificado': 2 } },
    { modalidade: 'Psicoterapia', valores: { Externo: 107, Aluno: 64, Servidor: 0, Terceirizado: 2, 'Não identificado': 1 } },
    { modalidade: 'Neuropsicologia', valores: { Externo: 32, Aluno: 13, Servidor: 0, Terceirizado: 0, 'Não identificado': 3 } },
    { modalidade: 'Psicopedagogia', valores: { Externo: 13, Aluno: 3, Servidor: 0, Terceirizado: 0, 'Não identificado': 0 } },
    { modalidade: 'Grupo', valores: { Externo: 25, Aluno: 16, Servidor: 4, Terceirizado: 0, 'Não identificado': 10 } },
  ] as { modalidade: string; valores: Record<VinculoUFRN, number> }[],
  alunosPorCentro: [
    { rotulo: 'CCHLA', valor: 41 },
    { rotulo: 'CT', valor: 22 },
    { rotulo: 'CCSA', valor: 17 },
    { rotulo: 'CB', valor: 12 },
    { rotulo: 'IMD', valor: 9 },
    { rotulo: 'Outros', valor: 14 },
  ],
}
