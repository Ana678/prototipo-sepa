/**
 * Dados de EXEMPLO dos relatórios. Ordem de grandeza tirada dos Relatórios de Gestão 2024/2025,
 * mas os números são fictícios. Todo total é CALCULADO a partir das linhas, para as somas sempre fecharem.
 *
 * No sistema real, cada bloco sai de uma consulta:
 *  - usuários e atendimentos → fichas mensais validadas (com o mapeamento de `mapeamentos.ts`);
 *  - atividades e supervisões → registro de atividades coletivas;
 *  - extensão, lista de espera, equipe, curso/centro → fontes fora da ficha (ver `FONTES`).
 */
import { supervisores } from '../../data/mock'
import type { VinculoUFRN } from '../../types'
import { CATEGORIAS_RELATORIO, MODALIDADES_RELATORIO, VINCULOS_TERAPEUTA, type CategoriaRelatorio, type ModalidadeRelatorio, type VinculoTerapeuta } from './mapeamentos'

export const VINCULOS_UFRN: VinculoUFRN[] = ['Externo', 'Aluno', 'Servidor', 'Terceirizado', 'Não identificado']

export type Periodo = 'anual' | 'parcial'

/** De onde vem cada bloco — mostrado na tela para ninguém achar que a ficha resolve tudo. */
export const FONTES = {
  ficha: 'Fichas validadas',
  atividades: 'Registro de atividades',
  sigaa: 'SIGAA · preenchido pelo Registro',
  cadastro: 'Cadastro de atuantes (outro grupo)',
  aDefinir: 'Fonte a definir com o SEPA',
} as const
export type Fonte = keyof typeof FONTES

/* ---------- Base anual (exemplo) ---------- */

const USUARIOS_MOD_VINCULO: Record<ModalidadeRelatorio, Record<VinculoUFRN, number>> = {
  Acolhimento: { Externo: 80, Aluno: 39, Servidor: 3, Terceirizado: 2, 'Não identificado': 2 },
  Psicoterapia: { Externo: 107, Aluno: 64, Servidor: 0, Terceirizado: 2, 'Não identificado': 1 },
  Neuropsicologia: { Externo: 32, Aluno: 13, Servidor: 0, Terceirizado: 0, 'Não identificado': 3 },
  Psicopedagogia: { Externo: 13, Aluno: 3, Servidor: 0, Terceirizado: 0, 'Não identificado': 0 },
  Grupo: { Externo: 25, Aluno: 16, Servidor: 4, Terceirizado: 0, 'Não identificado': 10 },
}
/** Usuários em 2 e em 3 modalidades. Os em 1 são deduzidos, para fechar com a soma das modalidades. */
const EM_DUAS = 19
const EM_TRES = 3

const ATEND_MOD_TERAPEUTA: Record<ModalidadeRelatorio, Partial<Record<VinculoTerapeuta, number>>> = {
  Acolhimento: { 'Estagiário 4º ano': 250, 'Estagiário 5º ano': 10, 'Servidor (técnico)': 50 },
  Psicoterapia: { 'Estagiário 4º ano': 20, 'Estagiário 5º ano': 1300, 'Servidor (técnico)': 1290, Extensionista: 400, 'Estágio não obrigatório': 20 },
  Neuropsicologia: { 'Estagiário 4º ano': 150, 'Estagiário 5º ano': 60, 'Servidor (técnico)': 120, Especialização: 90 },
  Psicopedagogia: { 'Servidor (técnico)': 260 },
  Grupo: { 'Servidor (técnico)': 80, Extensionista: 120 },
}

/** Supervisões: encontros por mês (mar–nov) e tamanho médio do grupo de cada supervisor. */
const MESES_LETIVOS = ['mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov'] as const
const ENCONTROS_MES = [4, 4, 4, 4, 2, 4, 4, 4, 4]
const TAMANHO_GRUPO = [7, 6, 5, 4]

const ATIVIDADES_SEM_SUPERVISAO: Record<Exclude<CategoriaRelatorio, 'Ações Formativas — Supervisões de Estágio'>, { atividades: number; participacoes: number; projetoProprio?: boolean }> = {
  'Atividade Interna do Serviço': { atividades: 20, participacoes: 230 },
  'Ações Formativas': { atividades: 70, participacoes: 610 },
  'Ações Formativas — Projeto Acolher': { atividades: 30, participacoes: 250, projetoProprio: true },
  'Ações de Promoção em Saúde': { atividades: 10, participacoes: 70 },
  'Grupos Temáticos e Oficinas': { atividades: 35, participacoes: 150 },
  'Atividade de Representação do SEPA': { atividades: 4, participacoes: 10 },
}

const ATIVIDADES_FORA_SEPA = [
  { atividade: 'Aplicação de jogo educativo em escolas', atividades: 6, participacoes: 240 },
  { atividade: 'Aulas de servidores em outros departamentos', atividades: 4, participacoes: 160 },
  { atividade: 'Rodas de conversa em unidades parceiras', atividades: 8, participacoes: 310 },
  { atividade: 'Participação em colônia de férias', atividades: 2, participacoes: 90 },
]

const ACOES_EXTENSAO = [
  { titulo: 'Interações-Psi', papel: 'Proponente', categoria: 'Projeto', publico: 4200 },
  { titulo: 'Projeto Acolher', papel: 'Proponente', categoria: 'Projeto', publico: 368 },
  { titulo: 'Grupo Enfrentamento à Timidez', papel: 'Proponente', categoria: 'Projeto', publico: 55 },
  { titulo: 'Campanha de saúde mental na UFRN', papel: 'Proponente', categoria: 'Evento', publico: 300 },
  { titulo: 'Oficinas em escolas municipais', papel: 'Colaboradora', categoria: 'Projeto', publico: 420 },
  { titulo: 'Curso de primeiros cuidados psicológicos', papel: 'Colaboradora', categoria: 'Curso', publico: 150 },
] as const

const EQUIPE = [
  { vinculo: 'Técnicos', total: 15 },
  { vinculo: 'Docentes', total: 12 },
  { vinculo: 'Estagiários 4º ano', total: 28 },
  { vinculo: 'Estagiários 5º ano', total: 22 },
  { vinculo: 'Extensionistas', total: 18 },
  { vinculo: 'Pós-graduação', total: 6 },
]

const LISTA_ESPERA = [
  { rotulo: 'Psicoterapia infantil', valor: 38 },
  { rotulo: 'Psicoterapia adulto/idoso', valor: 30 },
  { rotulo: 'Neuropsicologia infantil', valor: 12 },
  { rotulo: 'Neuropsicologia adulto', valor: 4 },
  { rotulo: 'Psicopedagogia infantil', valor: 8 },
]

const ALUNOS_CENTRO = [
  { rotulo: 'CCHLA', valor: 41 },
  { rotulo: 'CT', valor: 22 },
  { rotulo: 'CCSA', valor: 17 },
  { rotulo: 'CB', valor: 12 },
  { rotulo: 'IMD', valor: 9 },
  { rotulo: 'Outros', valor: 14 },
]

/* ---------- Montagem (com totais calculados) ---------- */

const soma = (xs: number[]) => xs.reduce((a, b) => a + b, 0)

/** Parcial = 1º semestre, quando fecha o ciclo do 4º ano (entrevista 14). Exemplo: ~45% do ano. */
const FATOR: Record<Periodo, number> = { anual: 1, parcial: 0.45 }

export function gerarRelatorio(periodo: Periodo) {
  const f = FATOR[periodo]
  const r = (n: number) => Math.round(n * f)
  const mesesNoPeriodo = periodo === 'anual' ? MESES_LETIVOS.length : 5 // mar–jul

  const modVinculo = MODALIDADES_RELATORIO.map((modalidade) => {
    const valores = Object.fromEntries(VINCULOS_UFRN.map((v) => [v, r(USUARIOS_MOD_VINCULO[modalidade][v])])) as Record<VinculoUFRN, number>
    return { modalidade, valores, total: soma(Object.values(valores)) }
  })
  const somaModalidades = soma(modVinculo.map((m) => m.total))
  const emDuas = r(EM_DUAS)
  const emTres = r(EM_TRES)
  const emUma = somaModalidades - 2 * emDuas - 3 * emTres // garante: Σ modalidades = 1·n1 + 2·n2 + 3·n3
  const usuariosUnicos = emUma + emDuas + emTres

  const atendTerapeuta = MODALIDADES_RELATORIO.map((modalidade) => {
    const valores = Object.fromEntries(VINCULOS_TERAPEUTA.map((v) => [v, r(ATEND_MOD_TERAPEUTA[modalidade][v] ?? 0)])) as Record<VinculoTerapeuta, number>
    return { modalidade, valores, total: soma(Object.values(valores)) }
  })
  const atendimentos = soma(atendTerapeuta.map((a) => a.total))

  const supervisoes = supervisores.map((supervisor, i) => {
    const porMes = MESES_LETIVOS.slice(0, mesesNoPeriodo).map((mes, m) => ({ mes, encontros: ENCONTROS_MES[m], participacoes: ENCONTROS_MES[m] * TAMANHO_GRUPO[i] }))
    return { supervisor, porMes, encontros: soma(porMes.map((p) => p.encontros)), participacoes: soma(porMes.map((p) => p.participacoes)) }
  })
  const totalSupervisoes = { atividades: soma(supervisoes.map((s) => s.encontros)), participacoes: soma(supervisoes.map((s) => s.participacoes)) }

  const atividadesSEPA = CATEGORIAS_RELATORIO.map((categoria) => {
    if (categoria === 'Ações Formativas — Supervisões de Estágio') return { categoria, ...totalSupervisoes, projetoProprio: false }
    const base = ATIVIDADES_SEM_SUPERVISAO[categoria]
    return { categoria, atividades: r(base.atividades), participacoes: r(base.participacoes), projetoProprio: !!base.projetoProprio }
  })
  const foraSEPA = ATIVIDADES_FORA_SEPA.map((a) => ({ ...a, atividades: r(a.atividades), participacoes: r(a.participacoes) }))

  return {
    periodo,
    meses: MESES_LETIVOS.slice(0, mesesNoPeriodo),
    equipe: EQUIPE,
    extensao: ACOES_EXTENSAO.map((a) => ({ ...a, publico: r(a.publico) })),
    usuarios: {
      unicos: usuariosUnicos,
      porQtdModalidades: [
        { rotulo: 'Em 1 modalidade', valor: emUma },
        { rotulo: 'Em 2 modalidades', valor: emDuas },
        { rotulo: 'Em 3 modalidades', valor: emTres },
      ],
      porModalidade: modVinculo.map((m) => ({ rotulo: m.modalidade, valor: m.total })),
      modVinculo,
      alunosPorCentro: ALUNOS_CENTRO.map((a) => ({ ...a, valor: r(a.valor) })),
    },
    atendimentos: {
      total: atendimentos,
      porModalidade: atendTerapeuta.map((a) => ({ rotulo: a.modalidade, valor: a.total })),
      porTerapeuta: atendTerapeuta,
    },
    atividadesSEPA,
    totalAtividadesSEPA: { atividades: soma(atividadesSEPA.map((a) => a.atividades)), participacoes: soma(atividadesSEPA.map((a) => a.participacoes)) },
    /** Relatório do Interações: atividades no SEPA SEM projetos próprios + atividades fora do SEPA. */
    interacoes: {
      noSEPA: atividadesSEPA.filter((a) => !a.projetoProprio),
      foraSEPA,
      totalFora: { atividades: soma(foraSEPA.map((a) => a.atividades)), participacoes: soma(foraSEPA.map((a) => a.participacoes)) },
    },
    supervisoes,
    totalSupervisoes,
    listaEspera: LISTA_ESPERA,
  }
}

export type Relatorio = ReturnType<typeof gerarRelatorio>
