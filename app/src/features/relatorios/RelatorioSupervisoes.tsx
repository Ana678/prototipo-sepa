import { StatTile } from '../../components/ui/StatTile'
import type { Relatorio } from './dadosRelatorio'
import { Secao } from './Secao'

const fmt = new Intl.NumberFormat('pt-BR')

/** Encontros e participações por supervisor e mês (aba "Supervisões" da planilha; pedido na entrevista 12). */
export function RelatorioSupervisoes({ r }: { r: Relatorio }) {
  const { supervisoes, totalSupervisoes, meses } = r
  const celula = 'px-3 py-2.5 text-right tabular-nums'

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatTile rotulo="Encontros de supervisão" valor={fmt.format(totalSupervisoes.atividades)} detalhe={`${supervisoes.length} supervisores`} />
        <StatTile rotulo="Participações" valor={fmt.format(totalSupervisoes.participacoes)} detalhe="Estagiários, extensionistas e supervisor" />
        <StatTile
          rotulo="Média por encontro"
          valor={(totalSupervisoes.participacoes / (totalSupervisoes.atividades || 1)).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}
          detalhe="participantes"
        />
      </div>

      <Secao numero={1} titulo="Supervisões por supervisor e mês" referencia="encontros · participações" fonte="atividades">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-medium tracking-wide text-slate-500 uppercase dark:border-slate-800 dark:text-slate-400">
                <th className="px-3 py-2.5 text-left">Supervisor(a)</th>
                {meses.map((m) => (
                  <th key={m} className="px-3 py-2.5 text-right">{m}</th>
                ))}
                <th className="px-3 py-2.5 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {supervisoes.map((s) => (
                <tr key={s.supervisor}>
                  <td className="px-3 py-2.5 font-medium whitespace-nowrap text-slate-800 dark:text-slate-100">{s.supervisor}</td>
                  {s.porMes.map((p) => (
                    <td key={p.mes} className={celula}>
                      <span className="text-slate-800 dark:text-slate-100">{p.encontros}</span>
                      <span className="text-slate-400 dark:text-slate-500"> · {p.participacoes}</span>
                    </td>
                  ))}
                  <td className={celula}>
                    <span className="font-semibold text-slate-900 dark:text-slate-50">{s.encontros}</span>
                    <span className="text-slate-500 dark:text-slate-400"> · {s.participacoes}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Cada célula: encontros · participações. Vem das atividades registradas como “Supervisão de Estágio”, que agora pedem o supervisor.
        </p>
      </Secao>
    </div>
  )
}
