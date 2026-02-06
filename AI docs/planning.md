# Semente de Ogum — Implementation Plan

## Project Summary

A web-based ENEM mock exam platform for the "Semente de Ogum" free preparatory course. Students take timed ENEM simulations; teachers create exams and analyze results. Built with Next.js 16, Tailwind CSS 4, TypeScript, and Firebase (free tier).

---

## Phase 0 — Project Setup & Brand Foundation

### 0.1 Tailwind Theme Configuration

Map the brand's visual identity into the Tailwind theme:

| Token              | HEX       | Usage                              |
| ------------------ | --------- | ---------------------------------- |
| `green-100`        | `#cce8b7` | Backgrounds, hover states          |
| `green-200`        | `#9ec187` | Secondary backgrounds, borders     |
| `green-400`        | `#5e914c` | Icons, secondary text              |
| `green-500`        | `#5b8b07` | Primary buttons, links, accents    |
| `green-700`        | `#336130` | Active states, emphasis            |
| `green-900`        | `#15311a` | Dark backgrounds, headings, footer |

### 0.2 Typography

- Replace `Geist` with **Poppins** (Google Fonts) in `layout.tsx`
- Configure weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- Heading tracking: `-0.055em` (letter-spacing -55 per brand manual)
- Line height: `0.8` for display headings, standard for body text

### 0.3 Logo Assets

Available at `public/images/brand/logo/`:

| File              | Usage                              |
| ----------------- | ---------------------------------- |
| `logo-primary.png`| Header/navbar (light backgrounds)  |
| `green-logo.png`  | App icon, favicon, mint background |
| `white-logo.png`  | Light variant on white backgrounds |
| `black-logo.png`  | Dark mode, dark sections           |

### 0.4 Metadata & SEO

- Title: `Semente de Ogum — Simulado ENEM`
- Description: `Cursinho preparatório gratuito. Plataforma de simulados ENEM.`
- OpenGraph image using `green-logo.png`
- Generate favicon from logo

### Tasks

- [ ] Configure Tailwind theme with brand colors
- [ ] Set up Poppins font in `layout.tsx`
- [ ] Update metadata in `layout.tsx`
- [ ] Generate and set favicon

---

## Phase 1 — Firebase Integration

### 1.1 Firebase Setup

- Install `firebase` package
- Create `lib/firebase.ts` with app initialization
- Environment variables: `NEXT_PUBLIC_FIREBASE_*`

### 1.2 Authentication

- Firebase Auth with email/password
- Auth context provider (`contexts/AuthContext.tsx`)
- Custom hook `useAuth()` exposing: `user`, `role`, `signIn`, `signUp`, `signOut`, `resetPassword`
- Role stored in Firestore `users` collection: `{ uid, email, name, role: "student" | "teacher", createdAt }`

### 1.3 Firestore Collections

```
users/
  {uid}: { email, name, role, createdAt }

exams/
  {examId}: { title, createdBy, day (1|2), status, createdAt, publishedAt }

questions/
  {questionId}: { examId, subject, text, imageBase64?, alternatives[], correctAnswer, order }

answers/
  {answerId}: { examId, userId, questionId, selectedAnswer, answeredAt }

results/
  {resultId}: { examId, userId, score, totalQuestions, subjectBreakdown, startedAt, finishedAt }
```

### Tasks

- [ ] Install Firebase SDK
- [ ] Create Firebase config module
- [ ] Set up `.env.local` with Firebase keys
- [ ] Create AuthContext + useAuth hook
- [ ] Define Firestore types in `types/`

---

## Phase 2 — Authentication Pages

### 2.1 Routes

| Route              | Description              |
| ------------------ | ------------------------ |
| `/login`           | Email/password sign in   |
| `/register`        | Account creation + role  |
| `/reset-password`  | Password reset via email |

### 2.2 UI Components

- `AuthLayout` — centered card, logo on top, green gradient background
- `Input` — styled text input with label and error state
- `Button` — primary (green-500), outlined, disabled variants
- `RoleSelector` — student/teacher toggle for registration

### Tasks

- [ ] Create auth layout component
- [ ] Build login page
- [ ] Build register page with role selection
- [ ] Build reset password page
- [ ] Add route protection middleware

---

## Phase 3 — Student Area

### 3.1 Routes

| Route                 | Description                |
| --------------------- | -------------------------- |
| `/student`            | Dashboard — available exams |
| `/student/profile`    | Profile & exam history     |
| `/student/exam/[id]`  | Exam execution view        |
| `/student/result/[id]`| Result details             |

### 3.2 Dashboard

- Exam cards showing: title, subject count, status badge
- Status: `Não iniciado` / `Em andamento` / `Concluído`
- Filter by Day 1 / Day 2

### 3.3 Exam Execution (Core Feature)

**Layout:**
- Left panel: question navigation grid (numbered buttons, color-coded answered/unanswered)
- Center: question display (text + optional image + alternatives)
- Bottom-right: floating timer

**Timer:**
- Duration: 5h30m (330 minutes)
- Stored start time in Firestore to prevent refresh exploits
- Red warning at 30 minutes remaining
- Minimizable icon
- Auto-submit at zero

**Navigation:**
- Previous / Next buttons
- Direct jump via left panel
- "Finalizar Prova" button with confirmation modal

**Answer Storage:**
- Save each answer individually to Firestore on selection
- Track answered count in real-time

### 3.4 Results

- Score summary (correct / total)
- Subject breakdown chart
- Question review: show selected vs correct answer

### Tasks

- [ ] Create student layout with sidebar
- [ ] Build dashboard with exam cards
- [ ] Build exam execution page with timer
- [ ] Build question navigation panel
- [ ] Implement answer persistence
- [ ] Build auto-submit logic
- [ ] Build results page with subject breakdown

---

## Phase 4 — Teacher Area

### 4.1 Routes

| Route                         | Description                |
| ----------------------------- | -------------------------- |
| `/teacher`                    | Dashboard — created exams  |
| `/teacher/exam/new`           | New exam wizard            |
| `/teacher/exam/[id]`          | Exam detail + results      |
| `/teacher/exam/[id]/results`  | Student results list       |

### 4.2 Exam Creation Wizard

**Step 1 — Exam Info:**
- Title, Day (1 or 2)
- Auto-suggest 45 questions × 2 subjects based on day

**Step 2 — Question Creation:**
- Subject label
- Question text (textarea)
- Optional image upload (client-side resize → Base64)
- Multiple alternatives (A–E), mark correct
- Live preview card
- Add / remove / reorder questions

**Step 3 — Exam Summary:**
- Total question count
- Subject distribution table
- Full preview scroll
- Publish button with confirmation

**Image Processing (Base64):**
- Client-side resize to max 800px width
- JPEG compression (quality ~0.6)
- Display Base64 string size as feedback
- Reject if > 900KB (Firestore document limit safety)

### 4.3 Results Analysis

- Table: student name, score, completion time
- Click to expand: per-student answer breakdown
- Subject-level aggregated stats

### Tasks

- [ ] Create teacher layout
- [ ] Build exam creation wizard (3 steps)
- [ ] Build image upload + Base64 compression
- [ ] Build question editor with live preview
- [ ] Build exam summary + publish flow
- [ ] Build results dashboard with student list
- [ ] Build per-student answer review

---

## Phase 5 — Shared Components & Polish

### 5.1 Component Library

| Component         | Description                                       |
| ----------------- | ------------------------------------------------- |
| `Navbar`          | Logo + nav links + user menu, role-aware           |
| `Sidebar`         | Collapsible navigation for dashboard areas         |
| `Button`          | Variants: primary, outlined, danger, disabled       |
| `Input`           | Text, email, password with error/label             |
| `Card`            | Content container with padding/shadow              |
| `Modal`           | Confirmation dialogs (exam finish, publish)         |
| `Badge`           | Status indicators (colored dot + text)             |
| `Timer`           | Floating countdown with minimize/expand            |
| `QuestionCard`    | Display question + alternatives + optional image   |
| `ProgressBar`     | Answered questions progress                        |

### 5.2 UX Polish

- Loading skeletons for data fetching
- Empty states with illustrations
- Toast notifications for actions (save, submit, publish)
- Responsive design: mobile-friendly exam taking
- Keyboard navigation for question alternatives

### Tasks

- [ ] Build shared component library
- [ ] Add loading states and skeletons
- [ ] Add toast notification system
- [ ] Responsive pass on all pages
- [ ] Accessibility audit (focus states, ARIA labels)

---

## Phase 6 — Security & Rules

### 6.1 Firestore Rules

- Students can only read published exams
- Students can only write to their own answers/results
- Teachers can only CRUD their own exams/questions
- Exams cannot be edited after `status: "published"`

### 6.2 Route Protection

- Middleware checks auth state + role
- Redirect unauthenticated users to `/login`
- Redirect wrong-role users to their dashboard

### Tasks

- [ ] Write Firestore security rules
- [ ] Implement Next.js middleware for route protection
- [ ] Test role-based access scenarios

---

## Suggested File Structure

```
app/
├── layout.tsx                    # Root layout (Poppins, metadata)
├── page.tsx                      # Landing/redirect
├── globals.css                   # Tailwind + brand theme
├── login/page.tsx
├── register/page.tsx
├── reset-password/page.tsx
├── student/
│   ├── layout.tsx                # Student shell (navbar + sidebar)
│   ├── page.tsx                  # Dashboard
│   ├── profile/page.tsx
│   ├── exam/[id]/page.tsx        # Exam execution
│   └── result/[id]/page.tsx      # Result view
├── teacher/
│   ├── layout.tsx                # Teacher shell
│   ├── page.tsx                  # Dashboard
│   ├── exam/
│   │   ├── new/page.tsx          # Creation wizard
│   │   └── [id]/
│   │       ├── page.tsx          # Exam detail
│   │       └── results/page.tsx  # Student results
lib/
├── firebase.ts                   # Firebase init
├── auth.ts                       # Auth helpers
├── firestore.ts                  # Firestore helpers
components/
├── ui/                           # Button, Input, Card, Modal, Badge...
├── layout/                       # Navbar, Sidebar, AuthLayout
├── exam/                         # Timer, QuestionCard, QuestionNav
├── teacher/                      # QuestionEditor, ExamSummary
contexts/
├── AuthContext.tsx
hooks/
├── useAuth.ts
├── useExam.ts
├── useTimer.ts
types/
├── user.ts
├── exam.ts
├── question.ts
├── result.ts
```

---

## Implementation Order

| Order | Phase | Estimated Effort | Dependency |
| ----- | ----- | ---------------- | ---------- |
| 1     | Phase 0 — Setup & Brand | Small | None |
| 2     | Phase 1 — Firebase | Small | Phase 0 |
| 3     | Phase 2 — Auth Pages | Medium | Phase 1 |
| 4     | Phase 3 — Student Area | Large | Phase 2 |
| 5     | Phase 4 — Teacher Area | Large | Phase 2 |
| 6     | Phase 5 — Polish | Medium | Phase 3 + 4 |
| 7     | Phase 6 — Security | Small | Phase 3 + 4 |

> **Phases 3 and 4 can be developed in parallel** after auth is complete.
