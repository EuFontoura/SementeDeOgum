# Semente de Ogum — Simulado ENEM

Plataforma web de simulados ENEM para o cursinho preparatório gratuito **Semente de Ogum**.

Alunos realizam simulados cronometrados no formato ENEM. Professores criam provas e analisam resultados.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS 4
- **Tipografia:** Poppins (Google Fonts)
- **Backend:** Firebase (Authentication + Firestore)
- **Plano:** Firebase free tier (sem Firebase Storage — imagens em Base64)

## Começando

### Pré-requisitos

- Node.js 18+
- Projeto Firebase com Authentication (Email/Password) e Firestore habilitados

### Instalação

```bash
npm install
```

### Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_TEACHER_INVITE_CODE=
```

A variável `NEXT_PUBLIC_TEACHER_INVITE_CODE` define o código de convite que professores precisam informar no cadastro.

### Executar

```bash
npm run dev       # desenvolvimento
npm run build     # build de produção
npm run start     # servir build
npm run lint      # linter
npx tsc --noEmit  # type check
```

## Estrutura do Projeto

```
app/
├── layout.tsx                     # Layout raiz (Poppins, metadata, providers)
├── page.tsx                       # Landing page
├── providers.tsx                  # Providers globais (Auth + Toast)
├── login/page.tsx                 # Login
├── register/page.tsx              # Cadastro (aluno/professor + código de convite)
├── reset-password/page.tsx        # Recuperação de senha
├── student/
│   ├── layout.tsx                 # Layout aluno (Navbar, Sidebar, RouteGuard)
│   ├── page.tsx                   # Dashboard — simulados disponíveis
│   ├── profile/page.tsx           # Perfil do aluno
│   ├── exam/[id]/
│   │   ├── layout.tsx             # Layout da prova (timer, navegação)
│   │   └── page.tsx               # Execução do simulado
│   └── result/[id]/page.tsx       # Resultado do simulado
└── teacher/
    ├── layout.tsx                 # Layout professor (Navbar, Sidebar, RouteGuard)
    ├── page.tsx                   # Dashboard — simulados criados + estatísticas
    ├── exam/new/page.tsx          # Criação de simulado
    └── exam/[id]/
        ├── page.tsx               # Detalhes do simulado
        └── results/               # Resultados dos alunos
components/
├── exam/
│   ├── QuestionCard.tsx           # Card de questão com alternativas
│   ├── QuestionNav.tsx            # Painel lateral de navegação entre questões
│   └── Timer.tsx                  # Timer minimizável (5h30, alerta em 30min)
├── layout/
│   ├── AuthLayout.tsx             # Layout das páginas de autenticação
│   ├── Navbar.tsx                 # Barra de navegação superior
│   ├── Sidebar.tsx                # Menu lateral (desktop)
│   ├── MobileNav.tsx              # Menu de navegação mobile
│   └── RouteGuard.tsx             # Proteção de rotas por role
└── ui/
    ├── Badge.tsx                  # Badge com variantes (default, warning, success)
    ├── Button.tsx                 # Botão com variantes (primary, outlined, danger)
    ├── Card.tsx                   # Card container reutilizável
    ├── Input.tsx                  # Input com label e estado de erro
    ├── Modal.tsx                  # Modal de confirmação
    ├── PasswordCriteria.tsx       # Checklist visual de critérios de senha
    ├── Skeleton.tsx               # Skeleton loading placeholder
    └── Toast.tsx                  # Notificação toast (success, error)
contexts/
├── AuthContext.tsx                # Provider de autenticação (user, role, loading)
└── ToastContext.tsx               # Provider de toasts globais
hooks/
├── useExam.ts                    # Carrega prova, questões e respostas do aluno
├── useExams.ts                   # Lista simulados com status do aluno
└── useTimer.ts                   # Timer regressivo de 5h30 com alerta
lib/
├── firebase.ts                   # Inicialização do Firebase
├── auth.ts                       # Helpers de autenticação (signUp, signIn, signOut, resetPassword)
├── firestore.ts                  # Helpers genéricos do Firestore (CRUD)
├── image.ts                      # Compressão e conversão de imagens para Base64
└── validation.ts                 # Validação de email, senha e código de convite
types/
├── user.ts                       # User, UserRole
├── exam.ts                       # Exam, ExamDay, ExamStatus
├── question.ts                   # Question, Alternative
└── result.ts                     # Result, Answer, SubjectScore
public/
├── images/brand/                 # Logos da marca
├── apple-touch-icon.png          # Ícone Apple Touch
├── icon-192.png                  # Ícone PWA 192×192
└── icon-512.png                  # Ícone PWA 512×512
```

## Funcionalidades

### Implementadas

- [x] Identidade visual (paleta de cores, tipografia, logos)
- [x] Autenticação (login, cadastro, recuperação de senha)
- [x] Cadastro com seleção de role (Aluno / Professor)
- [x] Código de convite para cadastro de professores
- [x] Validação de email e critérios de senha forte (8+ chars, maiúscula, minúscula, número, especial)
- [x] Proteção de rotas por role (RouteGuard)
- [x] Tipos Firestore definidos (users, exams, questions, answers, results)
- [x] Layout responsivo com Navbar, Sidebar e MobileNav
- [x] Sistema de toasts globais (sucesso / erro)
- [x] Área do aluno — dashboard com simulados e status (não iniciado, em andamento, concluído)
- [x] Área do aluno — execução de simulado com QuestionCard e QuestionNav
- [x] Área do aluno — perfil
- [x] Área do aluno — visualização de resultado
- [x] Timer de prova (5h30, alerta vermelho em 30min, auto-submit em 0)
- [x] Área do professor — dashboard com simulados criados e contagem de alunos
- [x] Área do professor — criação de simulado
- [x] Área do professor — detalhes do simulado
- [x] Área do professor — resultados dos alunos
- [x] Upload de imagens em Base64 (compressão client-side, max 800px, ≤900KB)
- [x] Componentes UI reutilizáveis (Button, Input, Card, Badge, Modal, Skeleton, Toast)

### Pendente

- [ ] Regras de segurança do Firestore

## Licença

Este projeto é licenciado sob a [GNU Affero General Public License v3.0](LICENSE).

O nome "Semente de Ogum", logotipos e demais elementos visuais da marca (contidos em `public/images/brand/`) **não** são cobertos por esta licença e pertencem à organização Semente de Ogum.

## Identidade Visual

Baseada no [Manual de Identidade Visual](visual-identity.md) da marca.

| Cor          | HEX       |
| ------------ | --------- |
| Verde Claro  | `#cce8b7` |
| Verde Médio  | `#9ec187` |
| Verde Folha  | `#5e914c` |
| Verde Vivo   | `#5b8b07` |
| Verde Forte  | `#336130` |
| Verde Noite  | `#15311a` |
