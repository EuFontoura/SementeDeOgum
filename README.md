# Semente de Ogum — Simulado ENEM

Plataforma web de simulados ENEM para o cursinho preparatório gratuito **Semente de Ogum**.

Alunos realizam simulados cronometrados no formato ENEM. Professores criam provas e analisam resultados.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS 4
- **Tipografia:** Poppins (Google Fonts)
- **Backend:** Firebase (Authentication + Firestore)
- **Plano:** Firebase free tier

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
├── layout.tsx              # Layout raiz (Poppins, metadata, providers)
├── page.tsx                # Landing page
├── login/page.tsx          # Login
├── register/page.tsx       # Cadastro (aluno/professor + código de convite)
├── reset-password/page.tsx # Recuperação de senha
├── student/                # Área do aluno (em desenvolvimento)
└── teacher/                # Área do professor (em desenvolvimento)
components/
├── layout/
│   ├── AuthLayout.tsx      # Layout das páginas de autenticação
│   └── RouteGuard.tsx      # Proteção de rotas por role
└── ui/
    ├── Button.tsx           # Botão com variantes (primary, outlined, danger)
    ├── Input.tsx            # Input com label e estado de erro
    └── PasswordCriteria.tsx # Checklist visual de critérios de senha
contexts/
└── AuthContext.tsx          # Provider de autenticação (user, role, loading)
lib/
├── firebase.ts             # Inicialização do Firebase
├── auth.ts                 # Helpers de autenticação (signUp, signIn, signOut, resetPassword)
├── firestore.ts            # Helpers genéricos do Firestore (CRUD)
└── validation.ts           # Validação de email, senha e código de convite
types/
├── user.ts                 # User, UserRole
├── exam.ts                 # Exam, ExamDay, ExamStatus
├── question.ts             # Question, Alternative
└── result.ts               # Result, Answer, SubjectScore
public/
└── images/brand/logo/      # Logos da marca
```

## Funcionalidades

### Implementadas

- [x] Identidade visual (paleta de cores, tipografia, logos)
- [x] Autenticação (login, cadastro, recuperação de senha)
- [x] Cadastro com seleção de role (Aluno / Professor)
- [x] Código de convite para cadastro de professores
- [x] Validação de email
- [x] Critérios de senha forte (8+ chars, maiúscula, minúscula, número, especial)
- [x] Proteção de rotas por role (RouteGuard)
- [x] Tipos Firestore definidos (users, exams, questions, answers, results)

### Em desenvolvimento

- [ ] Área do aluno (dashboard, execução de simulado, resultados)
- [ ] Área do professor (criação de provas, análise de resultados)
- [ ] Timer de prova (5h30, auto-submit)
- [ ] Upload de imagens em Base64
- [ ] Regras de segurança do Firestore

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
