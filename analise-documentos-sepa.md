# Análise dos documentos do SEPA: módulo de Fichas de Atendimento e Relatórios

Data da análise: 18/11/2026
Fonte: pasta `documentos/` (23 arquivos)

> **Sobre privacidade:** as planilhas "Limpa" ainda têm nomes, telefones e e-mails reais de estudantes. O "modelo" da ficha mensal foi enviado preenchido, com nomes de usuários atendidos e datas de sessões, ou seja, dado de saúde. Este documento cita pessoas só pela função. Não publique nem compartilhe esses arquivos fora do grupo sem anonimizar antes.

---

## 1. O que foi analisado

| Origem | Arquivos | O que traz |
|---|---|---|
| **Feitos por nós (alunos)** | `Relatório de Alinhamento de Escopo`, `SEPA - Grupo 7.pdf` | Escopo revisado no Canvas, regras de negócio que assumimos, dúvidas em aberto e o roteiro de perguntas P1–P15 |
| **Enviados pelo SEPA** | Relatórios de Gestão 2023, 2024 e 2025 (PDF) | O **produto final** que a gestão entrega: as seções e os quadros que precisam ser gerados |
| | `Dados para Relatórios 2026.xlsx` | A planilha que consolida os números de cada quadro do relatório de gestão e do relatório do Interações. Na prática, é a **especificação de saída** |
| | `Planilha de Atividades e Participação 2026.xlsx` | O "banco de dados" atual: atendimentos mês a mês por estagiário, técnica, extensão e supervisão, além das atividades presenciais |
| | `Acompanhamento permissão para reserva de salas.xlsx` | Liberação mensal de cada estagiário ou extensionista, em janelas que vão do dia 15 ao dia 15 |
| | `DADOS CADASTRAIS - DISCENTES E EXTENSIONISTAS 2026.xlsx` | Cadastro de quem atende: orientador, supervisor de campo, matrícula, modalidade, se tem SigSaúde etc. |
| | `Situação dos alunos para nada consta.xlsx` | Pendência por aluno em cada ano (2023, 2024, 2025), com a coluna "Inserido no SIPAC?" |
| | `Modelo_Ficha_Acompanhamento_Mensal_SEPA.docx` | A ficha mensal que estagiários, extensionistas e técnicos preenchem |
| **Entrevistas** | 12 transcrições (`UFRN... .m4a.csv`) com a servidora do Setor de Registro | Como o fluxo funciona hoje, onde dói e o que ela espera receber |

As transcrições **2 e 8** não estão na pasta (os números pulam de 1 para 3 e de 7 para 9). Pode ter faltado alguma parte da entrevista.

---

## 2. Como o fluxo funciona hoje

```
Estagiário / extensionista / técnico
   │  atende (sem computador na sala; o registro é feito depois)
   ├──► SigSaúde: agenda (às vezes de forma retroativa) e registra o prontuário
   └──► Ficha de Acompanhamento Mensal (.docx) por e-mail até o DIA 05 do mês seguinte
         (cópia para o supervisor de campo)
                │
Supervisor de campo: confere a ficha com o SigSaúde ("triangulação")
   ├─ divergência → pede ao aluno para retificar a ficha ou o SigSaúde
   └─ ok → e-mail ao Registro dizendo "zero pendências"
                │
Setor de Registro (uma servidora + bolsista)
   ├─ digita a ficha na Planilha de Atividades (número por mês e datas em comentário)
   ├─ marca Ficha OK / SigSaúde OK (verde ou vermelho) e o desfecho do caso
   ├─ atualiza a planilha de permissão de salas (janela do dia 15 ao dia 15)
   └─ no meio e no fim do ano, consolida tudo na planilha "Dados para Relatórios"
                │
Recepção: antes de entregar a chave, consulta a planilha de permissão
Gestão (direção): usa os números no Relatório de Gestão anual e no relatório do Interações (SIGAA)
```

**O SigSaúde não é fonte para os relatórios.** Ele guarda o cadastro dos usuários e os prontuários, mas o módulo de relatórios dele não é confiável: tem prontuários duplicados, prontuários que não podem ser editados depois de finalizados e idades absurdas, como "700 anos". Além disso, o Registro não pode ler os prontuários, porque são sigilosos. Hoje **a ficha mensal é a fonte da verdade dos quantitativos.**

---

## 3. Dificuldades relatadas (por ordem de impacto)

1. **A ficha chega por e-mail em Word, com campos abertos.** Isso gera erros bobos: mês errado, "duas datas mas três atendimentos", nome errado. A servidora não pode corrigir sozinha, porque o e-mail é o histórico oficial, e isso vira uma *"retificação sem fim"*.
2. **Atrasos e fichas que não chegam.** A cobrança é manual, com uma planilha de "verdinhos e vermelhinhos". Ela pediu: *"se tivesse um sistema que me avisasse"*.
3. **O relatório é refeito do zero a cada pedido.** Não dá para saber "onde parou", então ela prefere esperar e gerar tudo no fim. Ela quer *"num botão… uns filtros, e o bicho gera tudo"*.
4. **Contar usuários sem duplicidade é manual.** O mesmo usuário pode estar em até 3 modalidades. Hoje ela copia os nomes para outra planilha e confere um por um.
5. **Classificar atividades coletivas** (interna, formativa, Acolher, Interações, projeto próprio) é *"o que mais me dá dor de cabeça"*. Segundo ela, *"o problema maior está antes: como as informações chegam"*.
6. **Nada Consta:** é preciso abrir a planilha de cada ano para ver se o aluno deixou pendência. Ela quer *"botar fulaninho e o sistema dizer em que ano esteve, onde, e se deixou pendência"*.
7. **Limite de 1 ano (+1) de atendimento por usuário:** descobrir a data do primeiro atendimento exige um levantamento manual.
8. **A permissão de sala fica desconectada da agenda.** A recepção consulta duas fontes. *Isso é escopo do grupo de reserva de salas e chaves, mas os dados de pendência saem do nosso módulo.*
9. **A planilha depende de uma pessoa só.** Ela se preocupa: *"se eu sair, quem vem depois precisa entender sem mim"*.
10. Documentos digitalizados chegam com qualidade ruim. Isso fica fora do nosso escopo, mas vale registrar.

---

## 4. O que ela espera receber (resposta a P7–P11, P14 e P15)

### Relatórios: indicadores indispensáveis
Eles batem com os quadros dos Relatórios de Gestão de 2024 e 2025 e com as abas de `Dados para Relatórios 2026`:

- **Usuários únicos (sem duplicidade)** no ano
- Usuários atendidos em **1, 2 ou 3 modalidades**
- Usuários **por modalidade**: Acolhimento/Triagem, Psicoterapia, Neuropsicologia, Psicopedagogia, Grupo, Suporte/Orientação Acadêmica
- Usuários por **modalidade × vínculo com a UFRN**: externo, aluno, servidor, terceirizado, vínculo não identificado
- Alunos por **curso e centro**. Ela pediu isso; o relatório de 2023 tinha o quadro "discentes do CCHLA", e os de 2024 e 2025 não têm
- **Atendimentos**: total e por modalidade (4.220 em 2025)
- **Atendimentos por terapeuta**, com vínculo e modalidade
- **Atividades coletivas no espaço do SEPA** por categoria: quantidade de atividades e de participações (309 atividades e 2.075 participações em 2025)
- **Supervisões**: encontros e participações por supervisor e por mês
- **Atividades do Projeto Interações fora do SEPA**, que entram num relatório separado e excluem os projetos próprios
- **Pessoas que atuam no SEPA** por vínculo (técnicos, docentes, discentes, profissionais de saúde)
- Lista de espera por modalidade e público. Aparece no relatório, mas *não está claro de onde vem esse dado*

### Periodicidade e quem usa
- Geração **no meio do ano**, quando termina o 4º ano, e **no fim do ano**. Também há pedidos pontuais para tomar decisões.
- Quem gera os dados é o Registro. Quem analisa é a gestão (direção), que monta o Relatório de Gestão anual, o relatório do Interações no SIGAA e a prestação de contas para a equipe.

### Fichas
- A **mesma ficha mensal, só que como formulário no sistema**, com campos obrigatórios e validação, sem permitir envio incompleto, e com aviso automático de quem ainda não enviou.
- A ficha de cadastro de usuário ela até sugeriu (via QR code), mas ela mesma lembrou que o público tem dificuldade com acesso digital e que já tentaram e voltaram atrás. **Deixar fora da primeira versão.**

### Filtros e formatos
- Filtros citados: período (mês, semestre, ano), modalidade, vínculo, curso/centro, terapeuta/vínculo com o SEPA.
- **Formato de exportação: não foi perguntado ou não foi respondido.** Continua pendente (P11).

---

## 5. Regras de negócio encontradas nas fontes

| Regra | Fonte |
|---|---|
| Ficha mensal até o **dia 05** do mês seguinte, com cópia para o supervisor | Modelo da ficha; entrevista 4 |
| Nome do arquivo no padrão `FICHA_CLINICA_NOME_MÊS_ANO` | Modelo da ficha |
| A ficha registra o atuante (vínculo: 4º ano, 5º ano, extensão, pós ou técnico), as movimentações (início, desistência, perda de vaga por faltas, alta, encaminhamento) e as sessões por usuário (nome, CPF, datas, total, observação) separadas por modalidade | Modelo da ficha |
| O supervisor valida a ficha comparando com o SigSaúde e confirma por e-mail com "zero pendências" | Entrevista 5 |
| A permissão de sala vale em **janelas do dia 15 ao dia 15** e depende da validação do mês | Planilha de permissões; entrevista 5 |
| O supervisor pode pedir para **não bloquear** mesmo com pendência (exceção com observação) | Entrevista 5 |
| O bloqueio é **por pessoa**, não por vínculo: quem tem vínculo duplo é bloqueado em tudo | Entrevista 7 |
| Usuário atendido por **1 ano, prorrogável por mais 1** | Entrevista 5 |
| Existe uma regra de **perda de vaga por faltas**, *mas nenhuma fonte diz o número de faltas* | Entrevista 1 |
| **Dois campos de desfecho**, porque um encaminhamento não significa encerramento | Entrevista 5 |
| Usuário em várias modalidades conta **uma vez** no total | Entrevista 6; notas dos relatórios |
| O vínculo do usuário com a UFRN é obtido consultando o SigSaúde pelo CPF | Entrevista 5 |

---

## 6. ⚠️ Divergências com o nosso documento de escopo

O `Relatório de Alinhamento de Escopo` tem afirmações que **as fontes do SEPA não sustentam ou contradizem**:

| No nosso escopo | O que as fontes dizem | Sugestão |
|---|---|---|
| "Retiramos qualquer premissa de criação de interfaces de entrada de dados primários" | A principal demanda da servidora (P8) é justamente a **ficha como formulário no sistema**, com validação. Os problemas 1, 2 e 5 só se resolvem na entrada do dado | **Rever.** Esta é a decisão mais importante |
| "Prazo de **15 dias** para preenchimento e validação de prontuários" | Não aparece em nenhum documento do SEPA. O que existe é o prazo da ficha (dia 05) e a janela de permissão (dia 15 a dia 15) | Corrigir, ou confirmar com o SEPA de onde veio |
| "Perda de vaga após **3 faltas consecutivas**" | A regra existe, mas o número não aparece em nenhuma fonte | Perguntar o número |
| "Apenas criador e supervisor podem visualizar/editar antes da finalização" | Isso descreve o comportamento dos **prontuários do SigSaúde**, que não são nosso escopo | Reformular para a ficha: o aluno edita até enviar, e o supervisor valida |
| Dependência do SigSaúde para os relatórios | O Registro **não usa** dados do SigSaúde nos relatórios | Remover essa dependência |

### Dúvidas do nosso escopo que **já foram respondidas**
- **Dúvida 1 (indicadores):** respondida na seção 4.
- **Dúvida 3 (Nada Consta):** o que se precisa é o histórico do aluno por ano, com pendências (ficha e SigSaúde) e o registro no SIPAC.
- **Dúvida 4 (validação do supervisor):** hoje é o e-mail "zero pendências". No sistema, pode virar uma ação de "validar mês".
- **Dúvida 5 (SigSaúde):** não precisamos integrar com ele para os relatórios.

### Ainda em aberto
- Formato de exportação dos relatórios (P11).
- Número de faltas que leva à perda de vaga.
- De onde vem a lista de espera que aparece no relatório.
- Como classificar as atividades coletivas e quem informa isso (hoje chega por uma "folhinha" assinada e por colunas extras na ficha).
- Com os outros grupos: quem cuida do bloqueio de sala e da chave, e se o cadastro de estagiários e supervisores é nosso ou de outro grupo.
- As transcrições 2 e 8, que estão faltando.

---

## 7. Leitura geral

O SEPA hoje funciona como um **banco de dados feito à mão**: uma ficha em Word vira linhas em várias planilhas anuais, e essas planilhas viram os quadros do relatório. O valor do nosso módulo está em **fazer a ficha mensal entrar no sistema já estruturada e validada**. Com isso, os relatórios, o controle de pendências, o Nada Consta e o limite de 1 ano viram consultas sobre o mesmo dado, em vez de retrabalho.
