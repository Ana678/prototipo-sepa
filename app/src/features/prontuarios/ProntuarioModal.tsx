import { useState } from 'react'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { CampoData } from '../../components/ui/CampoData'
import { Label, Textarea } from '../../components/ui/Field'
import { IconEnviar, IconSalvar } from '../../components/ui/icons'
import { Modal } from '../../components/ui/Modal'
import { SelectMenu } from '../../components/ui/SelectMenu'
import { StatusProntuarioBadge } from '../../components/ui/StatusBadge'
import { useProntuarios, type DadosProntuario } from '../../context/ProntuarioContext'
import { useToast } from '../../context/ToastContext'
import { atuanteLogado, HOJE, meusUsuariosIds, usuarios } from '../../data/mock'
import { dataBR } from '../../lib/datas'
import type { Prontuario } from '../../types'
import { AvisoSigilo, HistoricoProntuario } from './HistoricoProntuario'

interface Props {
  aberto: boolean
  onFechar: () => void
  /** Prontuário existente (abre para ler ou corrigir). */
  prontuario?: Prontuario
  /** Para um novo: o que já se sabe (ex.: aberto pela ficha, com usuário e data da sessão). */
  inicial?: Partial<DadosProntuario>
  /** Aberto pela ficha: usuário e data vêm da linha e não mudam aqui. */
  sessaoFixa?: boolean
  onSalvo?: (p: Prontuario) => void
}

const MIN_TEXTO = 30

/** Registro do prontuário de uma sessão pelo aluno: data + usuário + anotações da consulta. */
export function ProntuarioModal({ aberto, onFechar, prontuario, inicial, sessaoFixa, onSalvo }: Props) {
  const { salvar, daSessao } = useProntuarios()
  const toast = useToast()
  const meus = usuarios.filter((u) => meusUsuariosIds.includes(u.id))
  const editavel = !prontuario || prontuario.status === 'rascunho' || prontuario.status === 'devolvido'

  const [usuarioId, setUsuarioId] = useState(prontuario?.usuarioId ?? inicial?.usuarioId ?? '')
  const usuario = usuarios.find((u) => u.id === usuarioId)
  const [modalidade, setModalidade] = useState(prontuario?.modalidade ?? inicial?.modalidade ?? usuario?.modalidades[0] ?? 'Psicoterapia')
  const [data, setData] = useState(prontuario?.data ?? inicial?.data ?? '')
  const [texto, setTexto] = useState(prontuario?.texto ?? '')
  const [resposta, setResposta] = useState('')
  const [tentou, setTentou] = useState(false)

  const ultimaDevolucao = prontuario?.status === 'devolvido' ? [...prontuario.eventos].reverse().find((e) => e.acao === 'devolvido') : undefined
  const duplicado = usuarioId && data ? daSessao(atuanteLogado.id, usuarioId, data) : undefined
  const erros = {
    usuario: !usuarioId ? 'Escolha o usuário atendido.' : '',
    data: !data ? 'Escolha a data da sessão.' : duplicado && duplicado.id !== prontuario?.id ? 'Já existe prontuário deste usuário nesta data.' : '',
    texto: texto.trim().length < MIN_TEXTO ? `Escreva as anotações da sessão (mínimo de ${MIN_TEXTO} caracteres).` : '',
  }

  function concluir(enviar: boolean) {
    setTentou(true)
    if (erros.usuario || erros.data || (enviar && erros.texto) || (!enviar && !texto.trim())) return
    const p = salvar(atuanteLogado.id, atuanteLogado.nome, { usuarioId, modalidade, data, texto }, { id: prontuario?.id, enviar, resposta })
    toast(enviar ? `Prontuário de ${dataBR(data)} enviado a ${atuanteLogado.supervisor}.` : 'Rascunho do prontuário salvo.')
    onSalvo?.(p)
    onFechar()
  }

  const msg = (e: string) => tentou && e && <p className="mt-1 text-xs font-medium text-red-700 dark:text-red-300">{e}</p>

  return (
    <Modal
      aberto={aberto}
      onFechar={onFechar}
      tamanho="lg"
      titulo={prontuario ? `Prontuário · ${usuario?.nome ?? ''}` : 'Registrar prontuário'}
      descricao={prontuario ? `Sessão de ${dataBR(prontuario.data)} · ${prontuario.modalidade}` : 'Uma sessão por prontuário: data, usuário e anotações da consulta.'}
      acoes={
        editavel ? (
          <>
            <Button variante="fantasma" onClick={onFechar}>Cancelar</Button>
            <Button variante="secundario" onClick={() => concluir(false)}>
              <IconSalvar size={18} /> Salvar rascunho
            </Button>
            <Button onClick={() => concluir(true)}>
              <IconEnviar size={18} /> {prontuario?.status === 'devolvido' ? 'Reenviar corrigido' : 'Enviar ao supervisor'}
            </Button>
          </>
        ) : (
          <Button variante="secundario" onClick={onFechar}>Fechar</Button>
        )
      }
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {prontuario && <StatusProntuarioBadge status={prontuario.status} />}
          <AvisoSigilo />
        </div>

        {ultimaDevolucao && (
          <Alert tom="aviso">
            <strong>{ultimaDevolucao.autor} devolveu em {dataBR(ultimaDevolucao.em)}:</strong> “{ultimaDevolucao.comentario}”
          </Alert>
        )}

        {editavel ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Usuário atendido</Label>
                <SelectMenu
                  ariaLabel="Usuário atendido"
                  value={usuarioId}
                  disabled={sessaoFixa || !!prontuario}
                  onChange={(v) => {
                    setUsuarioId(v)
                    const u = usuarios.find((x) => x.id === v)
                    if (u && !u.modalidades.includes(modalidade)) setModalidade(u.modalidades[0])
                  }}
                  opcoes={meus.map((u) => ({ valor: u.id, rotulo: u.nome }))}
                />
                {msg(erros.usuario)}
              </div>
              <div>
                <Label htmlFor="data-sessao">Data da sessão</Label>
                <CampoData id="data-sessao" value={data} onChange={setData} max={HOJE} disabled={sessaoFixa || !!prontuario} />
                {msg(erros.data)}
              </div>
            </div>
            {usuario && usuario.modalidades.length > 1 && !sessaoFixa && !prontuario && (
              <SelectMenu label="Modalidade" value={modalidade} onChange={setModalidade} opcoes={usuario.modalidades.map((m) => ({ valor: m, rotulo: m }))} />
            )}
            <div>
              <Label htmlFor="texto-prontuario">Anotações da consulta</Label>
              <Textarea
                id="texto-prontuario"
                rows={8}
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="O que foi trabalhado na sessão, intervenções, combinados para a próxima…"
              />
              {msg(erros.texto)}
            </div>
            {prontuario?.status === 'devolvido' && (
              <div>
                <Label htmlFor="resposta">Resposta ao supervisor (opcional)</Label>
                <Textarea id="resposta" rows={2} value={resposta} onChange={(e) => setResposta(e.target.value)} placeholder="Ex.: incluí a intervenção e o combinado." />
              </div>
            )}
          </>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap text-slate-800 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100">
            {prontuario?.texto}
          </div>
        )}

        {prontuario && prontuario.eventos.length > 0 && (
          <section>
            <h3 className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">Andamento</h3>
            <HistoricoProntuario eventos={prontuario.eventos} />
          </section>
        )}
      </div>
    </Modal>
  )
}
