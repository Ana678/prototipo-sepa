/**
 * Como o que entra pela FICHA e pelo REGISTRO DE ATIVIDADES vira as linhas dos relatórios oficiais.
 * Fonte: Relatórios de Gestão 2023–2025, planilha "Dados para Relatórios 2026" e modelo da ficha.
 * Um único lugar: se o SEPA mudar uma categoria, muda aqui.
 */
import type { CategoriaAtividade, Modalidade } from '../../types'

/** Modalidades como aparecem nos relatórios (Quadros 6–12 de 2025). */
export const MODALIDADES_RELATORIO = ['Acolhimento', 'Psicoterapia', 'Neuropsicologia', 'Psicopedagogia', 'Grupo'] as const
export type ModalidadeRelatorio = (typeof MODALIDADES_RELATORIO)[number]

/**
 * Ficha → relatório. `null` = sem correspondência clara: PERGUNTAR AO SEPA.
 * A planilha ainda tem "Triagem de grupo" e "Orientação acadêmica" (2023), que a ficha não tem.
 */
export const MODALIDADE_FICHA_PARA_RELATORIO: Record<Modalidade, ModalidadeRelatorio | null> = {
  'Plantão Psicológico': 'Acolhimento', // relatório 2024: "Acolhimento/Plantão Psicológico"
  Psicoterapia: 'Psicoterapia',
  Neuropsicologia: 'Neuropsicologia',
  Psicopedagogia: 'Psicopedagogia',
  Grupo: 'Grupo',
  'Atenção Psicológica': null,
  Outra: null,
}

/** Vínculo de quem atende (Tabela 8 de 2024). */
export const VINCULOS_TERAPEUTA = ['Estagiário 4º ano', 'Estagiário 5º ano', 'Servidor (técnico)', 'Extensionista', 'Estágio não obrigatório', 'Especialização'] as const
export type VinculoTerapeuta = (typeof VINCULOS_TERAPEUTA)[number]

/** Categorias do Quadro 13 (2025) / Tabela 9 (2024). */
export const CATEGORIAS_RELATORIO = [
  'Atividade Interna do Serviço',
  'Ações Formativas',
  'Ações Formativas — Supervisões de Estágio',
  'Ações Formativas — Projeto Acolher',
  'Ações de Promoção em Saúde',
  'Grupos Temáticos e Oficinas',
  'Atividade de Representação do SEPA',
] as const
export type CategoriaRelatorio = (typeof CATEGORIAS_RELATORIO)[number]

/** Categoria do registro de atividade → linha do relatório. Atividades fora do SEPA não entram no Quadro 13. */
export const CATEGORIA_ATIVIDADE_PARA_RELATORIO: Record<CategoriaAtividade, CategoriaRelatorio | null> = {
  'Atividade Interna do Serviço': 'Atividade Interna do Serviço',
  'Ações Formativas': 'Ações Formativas',
  'Supervisão de Estágio': 'Ações Formativas — Supervisões de Estágio',
  Grupo: 'Grupos Temáticos e Oficinas',
  'Ações de Promoção em Saúde': 'Ações de Promoção em Saúde',
  'Representação do SEPA': 'Atividade de Representação do SEPA',
  'Projeto Interações (fora do SEPA)': null,
}

/**
 * Projetos que podem ser vinculados a uma atividade.
 * `proprio`: projeto próprio do SEPA — entra no Relatório de Gestão, mas é EXCLUÍDO do relatório do Interações (entrevista 6).
 */
export const PROJETOS = [
  { nome: 'Projeto Acolher', proprio: true },
  { nome: 'Grupo Enfrentamento à Timidez', proprio: false },
  { nome: 'Interações-Psi', proprio: false },
] as const

export const ehProjetoProprio = (projeto?: string) => PROJETOS.some((p) => p.nome === projeto && p.proprio)
