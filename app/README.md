# SEPA · Módulo de Fichas de Atendimento e Relatórios (protótipo v0.1)

Protótipo navegável do módulo, feito a partir da análise em `../analise-documentos-sepa.md`.
**Todos os dados são fictícios** (`src/data/mock.ts`); os totais do relatório usam como exemplo os números públicos do Relatório de Gestão 2025.

## Rodar

```bash
npm install
npm run dev      # http://localhost:5173
```

Use o seletor **"Ver como"** no topo para trocar de perfil e o botão de lua/sol para alternar entre **modo claro e escuro** (a escolha fica salva; na primeira visita segue o tema do sistema operacional).

## Stack
React 19 + TypeScript + Vite · Tailwind CSS v4 (tema em `src/index.css`, azul SEPA `#2D438F` = `sepa-600`) · React Router · Headless UI (selects acessíveis) · fonte **Rawline** (padrão gov.br, servida de `src/assets/fonts`) · ícones [Material Symbols](https://fonts.google.com/icons?icon.style=Rounded) Rounded (pacote `material-symbols` — importe sempre de `src/components/ui/icons.tsx`; para um ícone novo use `<Icon nome="..." />`).

## Selects
Não use `<select>` nativo: use `<SelectMenu>` (`src/components/ui/SelectMenu.tsx`), que aceita rótulo, descrição, ícone e tom de destaque por opção.

## Modo escuro
Feito com a variante `dark:` do Tailwind, ativada pela classe `.dark` no `<html>` (`src/context/ThemeContext.tsx`). Ao criar um componente, coloque sempre o par claro/escuro, ex.: `bg-white dark:bg-slate-900`, `text-slate-500 dark:text-slate-400`, `border-slate-200 dark:border-slate-800`.

## Estrutura

```
src/
  components/
    layout/      AppLayout, Sidebar (logo + menu por perfil), Topbar (troca de perfil)
    ui/          Button, Card, Field, DataTable, StatusBadge, StatTile, Alert, PageHeader
    charts/      BarChart
  context/       PerfilContext (perfil atual), ToastContext (avisos)
  features/
    fichas/      MinhasFichasPage, FichaFormPage, validarFicha.ts + seções da ficha
    supervisao/  ValidacaoPage, FichaDetalhe
    registro/    PainelMesPage, UsuariosPage, AtividadesPage, NadaConstaPage
    relatorios/  RelatoriosPage
  data/mock.ts   dados de exemplo
  lib/           datas (prazo dia 05, limites do mês, meses entre datas), cn
  types.ts       modelo de domínio (Ficha, Usuário, Atuante, Atividade…)
```

## Telas por perfil

| Perfil | Telas |
|---|---|
| Estagiário / Extensionista / Técnico | Minhas fichas · Preencher ficha do mês (com validação antes de enviar) |
| Supervisor de campo | Validar fichas (validar ou devolver com pendência, com opção "não bloquear salas") |
| Setor de Registro | Painel do mês · Usuários e casos (limite de 1 ano, 2 situações) · Atividades coletivas · Nada Consta · Relatórios |
| Gestão | Relatórios (modelos Gestão / Interações, filtros, exportação) |

## Em aberto (ver análise)
Formato de exportação · número de faltas para perda de vaga · origem da lista de espera · quem implementa o bloqueio de sala (outro grupo).
