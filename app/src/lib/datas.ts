const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']

/** "2026-11" → "novembro/2026" */
export function nomeReferencia(ref: string): string {
  const [ano, mes] = ref.split('-').map(Number)
  return `${MESES[mes - 1]}/${ano}`
}

/** "2026-11-03" → "03/11" */
export function diaMes(iso: string): string {
  const [, m, d] = iso.split('-')
  return `${d}/${m}`
}

/** "2026-11-03" → "03/11/2026" */
export function dataBR(iso: string): string {
  const [a, m, d] = iso.split('-')
  return `${d}/${m}/${a}`
}

/** Prazo de envio da ficha: dia 05 do mês seguinte à referência. */
export function prazoEnvio(ref: string): string {
  const [ano, mes] = ref.split('-').map(Number)
  const proxAno = mes === 12 ? ano + 1 : ano
  const proxMes = mes === 12 ? 1 : mes + 1
  return `${proxAno}-${String(proxMes).padStart(2, '0')}-05`
}

/** Primeiro e último dia do mês de referência (para limitar o seletor de datas). */
export function limitesDoMes(ref: string): { min: string; max: string } {
  const [ano, mes] = ref.split('-').map(Number)
  const ultimo = new Date(ano, mes, 0).getDate()
  return { min: `${ref}-01`, max: `${ref}-${String(ultimo).padStart(2, '0')}` }
}

/** Meses completos entre duas datas ISO. */
export function mesesEntre(inicioIso: string, fimIso: string): number {
  const [a1, m1, d1] = inicioIso.split('-').map(Number)
  const [a2, m2, d2] = fimIso.split('-').map(Number)
  let meses = (a2 - a1) * 12 + (m2 - m1)
  if (d2 < d1) meses -= 1
  return meses
}
