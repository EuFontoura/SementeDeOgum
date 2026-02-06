```

# Agenda

- How to use AI as a Software Engineer
- Available tools
- Workflow
- Alternative usages

# How to use AI as a Software Engineer

- modelos conversasionais (chat) local
  - context switching
  - integration (vscode, terminal, browser, shell local)
- Metodologias de uso de AI
  - SDD - Spec Driven-Development
    - spec/login.md
    - spec/login.plan.md
    - implementation

  - RPI - Research - **Spec** - Plan - Implement
    - Research (manual)
    - Spec
    - Plan
    - Implement

# Workflow

## Starting a project

- Step 1: generate project (manual or AI)
- Step 2: AI Guidelines (AGENTS.md)
- Step 3: Create specification template at specs/000-feature.md
- Step 4: Create implementation plan template at specs/000-feature-impl-plan.md

## Developing - new features

- Step 1: Create spec (AI) & review (Human)
- Step 2: Create implementation plan (AI) & review (Human)
- Step 3: Implement

## Developing - maintaining

- Step 1: Copy bug errors and as AI to investigate and generate a report.
- Step 2: Review and adjust
- Step 3: Implement

## (new) Developing - new features

- Step 1: Spec (High level) -> spec file
- Step 2: Research (business, tech, brading) -> research report
- Step 3: Plan (Low level) -> implementation plan file
- Step 4: Implement -> change files

```sh
\    step 1    /
 \   step 2   /
  \  step 3  /
   \ step 4 /
```

# Available tools

Famosinhos:

- cursor/cli: pago, caro, bom, famoso
- gemini/gemini-cli: free (limitacao de modelos), medio, intrusivo (altera coisa sem vc mandar)
- copilot-cli: free se vc tive acesso ao copilot, ok, pouco intrusivo, pensa pouco

Underdogs:

- crush: model agnostic (pode usar qualkquer modelo), bom, iterativo (pergunta mais)
- ampcode: free com ads (free mdoe), acesso a ferramentas do system (vc tem acessp ao psql, acesse o banco e me de a lista de client)
- antigravity (google): cursor free

Links:

- https://ampcode.com/
- https://antigravity.google/
- https://github.com/charmbracelet/crush

# Next

- MCP - Model-Context Protocol
- Docker
- Handoff process


```