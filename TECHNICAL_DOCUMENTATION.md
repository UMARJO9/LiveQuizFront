# LiveQuizFront - Technical Documentation

> **Enterprise-Level Technical Documentation Package**
> Generated: December 11, 2025
> Framework: React 19.2.0 | Build Tool: Vite 7.2.4

---

## Table of Contents

1. [System Overview](#step-1--system-overview)
2. [Component Documentation](#step-2--component-documentation)
3. [Pages & Routing](#step-3--pages--routing)
4. [State Management](#step-4--state-management)
5. [API Integration](#api-integration)
6. [Socket.IO Real-Time Layer](#socketio-real-time-layer)
7. [User Flows](#user-flows)

---

# STEP 1 — SYSTEM OVERVIEW

## Architecture Summary

| Aspect | Details |
|--------|---------|
| **Frontend Framework** | React 19.2.0 |
| **Build Tooling** | Vite 7.2.4 with @vitejs/plugin-react 5.1.1 |
| **State Management** | React Hooks (useState, useEffect, useCallback, useMemo, useRef) |
| **API Integration Layer** | Axios 1.13.2 with custom request wrappers |
| **Real-time Layer** | Socket.IO Client 4.8.1 |
| **Routing** | React Router DOM 6.28.0 |
| **Module System** | ES Modules (`"type": "module"`) |

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser                                  │
├─────────────────────────────────────────────────────────────────┤
│                      React Application                           │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    App.jsx (Router)                      │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │              Pages (Route Components)            │    │    │
│  │  │  ┌──────────┐ ┌──────────┐ ┌────────────────┐   │    │    │
│  │  │  │AuthPage  │ │TopicsPage│ │TeacherSession  │   │    │    │
│  │  │  └──────────┘ └──────────┘ │     Page       │   │    │    │
│  │  │                            └────────────────┘   │    │    │
│  │  └─────────────────────────────────────────────────┘    │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │           UI Components                          │    │    │
│  │  │  TopicCard, QuizCard, CreateTopicModal, etc.    │    │    │
│  │  └─────────────────────────────────────────────────┘    │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │           Custom Hooks                           │    │    │
│  │  │           useTeacherSession                      │    │    │
│  │  └─────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────────┤
│                     API Layer (src/api/)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  client.js   │  │  request.js  │  │  socket.js   │           │
│  │ (Axios+Auth) │  │ (Simplified) │  │ (Socket.IO)  │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
├─────────────────────────────────────────────────────────────────┤
│                     External Services                            │
│  ┌────────────────────────┐  ┌────────────────────────┐         │
│  │   REST API Backend     │  │   Socket.IO Server     │         │
│  │  (HTTP/HTTPS)          │  │   (WebSocket)          │         │
│  └────────────────────────┘  └────────────────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.2.0 | Core UI library |
| `react-dom` | ^19.2.0 | React DOM renderer |
| `react-router-dom` | ^6.28.0 | Client-side routing |
| `axios` | ^1.13.2 | HTTP client for REST API |
| `socket.io-client` | ^4.8.1 | Real-time WebSocket communication |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `vite` | ^7.2.4 | Build tool and dev server |
| `@vitejs/plugin-react` | ^5.1.1 | React plugin for Vite (Fast Refresh, JSX) |
| `eslint` | ^9.39.1 | Code linting |
| `@eslint/js` | ^9.39.1 | ESLint JavaScript rules |
| `eslint-plugin-react-hooks` | ^7.0.1 | React Hooks linting rules |
| `eslint-plugin-react-refresh` | ^0.4.24 | React Refresh compatibility |
| `globals` | ^16.5.0 | Global variables for linting |
| `@types/react` | ^19.2.5 | TypeScript definitions (for IDE support) |
| `@types/react-dom` | ^19.2.3 | TypeScript definitions (for IDE support) |

### NPM Scripts

```json
{
  "dev": "vite --host --port 5173",    // Development server
  "build": "vite build",                // Production build
  "lint": "eslint .",                   // Lint all files
  "preview": "vite preview"             // Preview production build
}
```

---

## Project Structure

```
LiveQuizFront/
├── index.html                    # HTML entry point
├── package.json                  # Dependencies and scripts
├── vite.config.js               # Vite configuration
├── eslint.config.js             # ESLint configuration
└── src/
    ├── main.jsx                 # Application entry point
    ├── App.jsx                  # Root component with routing
    ├── App.css                  # Global styles (auth, layout, cards)
    ├── index.css                # Base CSS reset and typography
    │
    ├── api/                     # API and communication layer
    │   ├── client.js            # Axios client with token refresh
    │   ├── request.js           # Simplified request wrapper
    │   └── socket.js            # Socket.IO client configuration
    │
    ├── hooks/                   # Custom React hooks
    │   └── useTeacherSession.js # Teacher session state management
    │
    ├── components/              # Reusable UI components
    │   ├── AddCard.jsx          # Add new item card button
    │   ├── CreateTopicModal.jsx # Modal for creating topics
    │   ├── ModalChooseQuestionType.jsx # Question type selector
    │   ├── QuestionCreateForm.jsx # New question form
    │   ├── QuestionEditCard.jsx # Question editor card
    │   ├── QuizCard.jsx         # Quiz display card (legacy)
    │   ├── TeacherQuizView.jsx  # Quiz execution view
    │   ├── TopicCard.jsx        # Topic card with start button
    │   └── TopicHeader.jsx      # Topic page header
    │
    └── pages/                   # Route-level page components
        ├── AuthPage.jsx         # Login page
        ├── MainPage.jsx         # Main page (legacy)
        ├── TopicsPage.jsx       # Topics list page
        ├── TopicPage.jsx        # Topic editor page
        └── TeacherSessionPage.jsx # Live session management
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `TopicCard.jsx` |
| Hooks | camelCase with `use` prefix | `useTeacherSession.js` |
| API modules | camelCase | `client.js`, `socket.js` |
| CSS files | PascalCase matching component | `App.css` |
| Pages | PascalCase with `Page` suffix | `AuthPage.jsx` |

---

## Main Functional Domains

### 1. Authentication Flow
- **Location**: `src/pages/AuthPage.jsx`
- **Purpose**: User login with email/password
- **Storage**: JWT tokens in localStorage (`token`, `refresh`, `user`)
- **Flow**: Login → Store tokens → Trigger `onAuth` callback → Navigate to main

### 2. Teacher Dashboard (Topics Management)
- **Location**: `src/pages/TopicsPage.jsx`
- **Purpose**: Display and manage quiz topics
- **Features**:
  - List all topics/quizzes
  - Create new topics via modal
  - Navigate to topic editor
  - Start quiz sessions

### 3. Topic/Quiz Editor
- **Location**: `src/pages/TopicPage.jsx`
- **Purpose**: Edit quiz metadata and questions
- **Features**:
  - Edit title, description, timer
  - Create/edit/delete questions
  - Support single and multiple choice questions
  - Inline validation

### 4. Quiz Session Management
- **Location**: `src/pages/TeacherSessionPage.jsx`, `src/hooks/useTeacherSession.js`
- **Purpose**: Real-time quiz session control
- **Features**:
  - Session lobby with student list
  - Real-time student join/leave tracking
  - Question-by-question progression
  - Live timer synchronization
  - Answer counting
  - Results and ranking display

### 5. Real-time Updates (Socket.IO)
- **Location**: `src/api/socket.js`, `src/hooks/useTeacherSession.js`
- **Purpose**: Bidirectional real-time communication
- **Events**: Session management, student tracking, quiz flow, results

---

# STEP 2 — COMPONENT DOCUMENTATION

## Component: App

### Location
`src/App.jsx`

### Type
- **Root Application Component**

### Description
Root component that handles authentication state and routing. Determines whether to show the login page or the main application based on the presence of a valid JWT token in localStorage.

### Props
None (root component)

### State (local)

| State | Type | Initial Value | Description |
|-------|------|---------------|-------------|
| `isAuthed` | `boolean` | Computed from localStorage | Authentication status |

### Connected State (global)
- **localStorage**: `token` - JWT access token

### Effects/Lifecycle
- Initial state computation reads from localStorage

### Event Handlers
None directly; passes `onAuth` callback to AuthPage

### API Calls
None

### Socket Events
None

### Child Components
- `AuthPage` (when not authenticated)
- `TopicsPage` (route: `/`)
- `TopicPage` (route: `/topic/:id`)
- `TeacherSessionPage` (route: `/teacher/session/:sessionId`)

### Styling
- Imports `./App.css`

---

## Component: AuthPage

### Location
`src/pages/AuthPage.jsx`

### Type
- **Page Component**

### Description
Login page with email and password form. Handles authentication via REST API and stores session data in localStorage.

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `onAuth` | `function` | Yes | - | Callback invoked on successful login |

### State (local)

| State | Type | Initial Value | Description |
|-------|------|---------------|-------------|
| `form` | `object` | `{ email: '', password: '' }` | Form field values |
| `errorMessage` | `string` | `''` | General error message |
| `fieldErrors` | `object` | `{}` | Per-field validation errors |
| `loading` | `boolean` | `false` | Submit loading state |

### Connected State (global)
None

### Effects/Lifecycle
None

### Event Handlers

| Handler | Purpose |
|---------|---------|
| `onChange` | Updates form state on input change |
| `handleSubmit` | Validates and submits login request |

### API Calls

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/login/` | Authenticate user |

### Socket Events
None

### Child Components
None (leaf component)

### Styling
- CSS classes from `App.css`: `auth-page`, `auth-card`, `auth-header`, `auth-title`, `auth-fields`, `auth-label`, `auth-input`, `auth-error`, `auth-button`

---

## Component: TopicsPage

### Location
`src/pages/TopicsPage.jsx`

### Type
- **Page Component**

### Description
Main dashboard displaying all quiz topics. Allows creating new topics and starting quiz sessions. Handles real-time session creation via Socket.IO.

### Props
None

### State (local)

| State | Type | Initial Value | Description |
|-------|------|---------------|-------------|
| `topics` | `array` | `[]` | List of topics/quizzes |
| `loading` | `boolean` | `true` | Data loading state |
| `error` | `string` | `''` | Error message |
| `showCreate` | `boolean` | `false` | Create modal visibility |
| `startingTest` | `number\|null` | `null` | Topic ID being started |
| `sessionError` | `string` | `''` | Session creation error |

### Connected State (global)
- **localStorage**: `user`, `token`, `refresh`

### Effects/Lifecycle

| Effect | Dependencies | Purpose |
|--------|--------------|---------|
| Socket connection | `[]` | Connect Socket.IO on mount |
| Fetch topics | `[]` | Load topics list on mount |

### Event Handlers

| Handler | Purpose |
|---------|---------|
| `handleLogout` | Clear tokens and redirect |
| `startTest` | Emit `teacher:create_session` event |
| `cancelStartTest` | Cancel pending session creation |

### API Calls

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/quizzes/` | Fetch all topics |

### Socket Events

**Emitted:**
| Event | Payload | Description |
|-------|---------|-------------|
| `teacher:create_session` | `{ topic_id }` | Request new session |

**Listened:**
| Event | Payload | Description |
|-------|---------|-------------|
| `teacher:session_created` | `{ session_id, code, topic, question_count }` | Session created successfully |
| `teacher:session_error` | `{ message }` | Session creation failed |

### Child Components
- `TopicCard`
- `AddCard`
- `CreateTopicModal`

### Styling
- CSS classes from `App.css`: `main-page`, `main-header`, `main-user`, `avatar`, `user-name`, `logout-button`, `main-content`, `quiz-grid`, `quiz-skeleton`, `error-text`
- Inline styles for modals

---

## Component: TopicPage

### Location
`src/pages/TopicPage.jsx`

### Type
- **Page Component**

### Description
Quiz/topic editor page. Allows editing topic metadata (title, description, timer) and managing questions (create, edit, delete). Supports single and multiple choice question types.

### Props
None (uses URL params)

### State (local)

| State | Type | Initial Value | Description |
|-------|------|---------------|-------------|
| `initial` | `object\|null` | `null` | Original topic data |
| `form` | `object` | `{ title, description, question_timer }` | Edited form values |
| `loading` | `boolean` | `true` | Loading state |
| `saving` | `boolean` | `false` | Save in progress |
| `successMsg` | `string` | `''` | Success notification |
| `errorMsg` | `string` | `''` | Error message |
| `fieldErrors` | `object` | `{}` | Field validation errors |
| `questions` | `array` | `[]` | Questions list |
| `baselineQuestions` | `object` | `{}` | Original question data (for dirty checking) |
| `savingMap` | `object` | `{}` | Per-question saving state |
| `savedMap` | `object` | `{}` | Per-question saved message |
| `questionErrors` | `object` | `{}` | Per-question errors |
| `deletingMap` | `object` | `{}` | Per-question deleting state |
| `deleteErrors` | `object` | `{}` | Per-question delete errors |
| `createForms` | `array` | `[]` | New question forms |
| `topicDeleting` | `boolean` | `false` | Topic deletion in progress |
| `topicDeleteError` | `string` | `''` | Topic deletion error |
| `questionType` | `string` | `'single'` | Default question type |
| `showTypeModal` | `boolean` | `false` | Type selection modal |

### Connected State (global)
- **URL params**: `id` (topic ID)

### Effects/Lifecycle

| Effect | Dependencies | Purpose |
|--------|--------------|---------|
| Fetch topic | `[id]` | Load topic with questions |

### Event Handlers

| Handler | Purpose |
|---------|---------|
| `onChange` | Update form field |
| `onSave` | Save topic metadata |
| `onSaveQuestion` | Save individual question |
| `onDeleteQuestion` | Delete question |
| `onCreateQuestion` | Create new question |
| `onToggleCreateOption` | Toggle correct answer (respects single/multiple) |

### API Calls

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/quizzes/{id}/` | Fetch topic with questions |
| PATCH | `/api/quizzes/{id}/` | Update topic metadata |
| DELETE | `/api/quizzes/{id}/` | Delete topic |
| POST | `/api/topics/{id}/questions/` | Create question |
| PATCH | `/api/questions/{id}/` | Update question |
| DELETE | `/api/questions/{id}/delete/` | Delete question |

### Socket Events
None

### Child Components
- `TopicHeader`
- `QuestionEditCard`
- `QuestionCreateForm`
- `ModalChooseQuestionType`

### Styling
- Inline style objects: `pageStyle`, `formStyle`, `labelStyle`, `inputStyle`, `textareaStyle`, `rowStyle`, `actionsStyle`, `successStyle`, `errorStyle`

---

## Component: TeacherSessionPage

### Location
`src/pages/TeacherSessionPage.jsx`

### Type
- **Page Component**

### Description
Teacher session management page. Displays lobby before quiz starts (session code, connected students, start button) and quiz execution interface after starting (questions, timer, results, ranking).

### Props
None (uses URL params and navigation state)

### State (local)
Uses `useTeacherSession` hook (see Hook documentation)

### Connected State (global)
- **URL params**: `sessionId`
- **Navigation state**: `code`, `topic`, `question_count`

### Effects/Lifecycle
Managed by `useTeacherSession` hook

### Event Handlers

| Handler | Purpose |
|---------|---------|
| `startSession` | Start the quiz session |
| `nextQuestion` | Load next question |
| Navigation | Back to home |

### API Calls
None directly (handled by hook)

### Socket Events
Managed by `useTeacherSession` hook

### Child Components
- `TeacherQuizView`

### Styling
- Inline style objects: `pageStyle`, `containerStyle`, `quizContainerStyle`, `headerStyle`, `codeBlockStyle`, `codeTextStyle`, `codeLabelStyle`, `studentListStyle`, `studentItemStyle`, `avatarStyle`, `backBtnStyle`

---

## Component: MainPage

### Location
`src/pages/MainPage.jsx`

### Type
- **Page Component (Legacy)**

### Description
Original main page for displaying quizzes. Similar to TopicsPage but uses `QuizCard` instead of `TopicCard` and lacks session creation functionality.

**Note**: This appears to be a legacy component that has been superseded by `TopicsPage`.

### Props
None

### State (local)

| State | Type | Initial Value | Description |
|-------|------|---------------|-------------|
| `quizzes` | `array` | `[]` | List of quizzes |
| `loading` | `boolean` | `true` | Loading state |
| `error` | `string` | `''` | Error message |
| `showCreate` | `boolean` | `false` | Create modal visibility |

### API Calls

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/quizzes/` | Fetch all quizzes |

### Child Components
- `QuizCard`
- `AddCard`
- `CreateTopicModal`

---

## Component: TeacherQuizView

### Location
`src/components/TeacherQuizView.jsx`

### Type
- **Feature Component**

### Description
Quiz execution view for teachers. Displays current question, answer options, timer, answer count, results after each question, and final quiz results with ranking.

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `currentQuestion` | `object\|null` | No | - | Current question data |
| `answerCount` | `object` | No | - | `{ answered, total }` counts |
| `timeLeft` | `number` | No | - | Remaining time in seconds |
| `showResults` | `boolean` | No | - | Show results view |
| `ranking` | `array` | No | - | Player ranking after question |
| `isQuizFinished` | `boolean` | No | - | Quiz completed flag |
| `timerExpired` | `boolean` | No | - | Timer expired flag |
| `finalResults` | `object\|null` | No | - | Final quiz results |
| `isLoadingNext` | `boolean` | No | - | Loading next question |
| `nextQuestion` | `function` | No | - | Callback to load next question |
| `onBackToHome` | `function` | No | - | Callback to navigate home |

### State (local)
None (presentational component)

### Render States
1. **Quiz Finished**: Final results with winners and scoreboard
2. **Show Results**: Question results with ranking
3. **Current Question**: Active question with timer and options
4. **Loading**: Spinner while waiting for first question

### Child Components
None (leaf component)

### Styling
- Inline style objects with dynamic styling for timer colors (green > yellow > red based on time remaining)
- Option cards use color rotation: red, blue, amber, green

---

## Component: TopicCard

### Location
`src/components/TopicCard.jsx`

### Type
- **UI Component (Reusable)**

### Description
Card component displaying a topic/quiz with title, description, timer, and "Start Test" button. Clicking the card navigates to the topic editor; clicking the button starts a quiz session.

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `topic` | `object` | Yes | - | Topic data object |
| `onStartTest` | `function` | No | - | Callback when start button clicked |

### State (local)
None

### Event Handlers

| Handler | Purpose |
|---------|---------|
| `handleCardClick` | Navigate to topic editor |
| `handleStartTest` | Trigger session creation (stops propagation) |

### Child Components
None (leaf component)

### Styling
- Inline `<style>` tag with scoped CSS classes: `topic-card-wrap`, `topic-card-glow`, `topic-card`, `topic-card-title`, `topic-card-desc`, `topic-card-timer`, `topic-card-start-btn`
- Hover effects with glow animation

---

## Component: QuizCard

### Location
`src/components/QuizCard.jsx`

### Type
- **UI Component (Reusable, Legacy)**

### Description
Card component for displaying a quiz. Similar to TopicCard but without start button.

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `id` | `number` | No | - | Quiz ID |
| `title` | `string` | No | - | Quiz title |
| `description` | `string` | No | - | Quiz description |
| `question_timer` | `number` | No | - | Timer per question |
| `onClick` | `function` | No | - | Optional click override |

### Styling
- Inline `<style>` tag with scoped CSS classes: `qc-wrap`, `qc-glow`, `qc-card`, `qc-title`, `qc-desc`, `qc-timer`

---

## Component: AddCard

### Location
`src/components/AddCard.jsx`

### Type
- **UI Component (Reusable)**

### Description
Simple card with a plus sign for adding new items. Used as the last item in grids to trigger creation actions.

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `onClick` | `function` | No | - | Click handler |

### Styling
- Inline `<style>` tag with scoped CSS classes: `ac-wrap`, `ac-card`, `ac-plus`

---

## Component: CreateTopicModal

### Location
`src/components/CreateTopicModal.jsx`

### Type
- **Feature Component (Modal)**

### Description
Modal dialog for creating a new topic/quiz. Includes fields for title, description, and question timer with validation.

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `onCancel` | `function` | No | - | Cancel/close callback |
| `onCreated` | `function` | No | - | Success callback with created topic |

### State (local)

| State | Type | Initial Value | Description |
|-------|------|---------------|-------------|
| `title` | `string` | `''` | Topic title |
| `description` | `string` | `''` | Topic description |
| `questionTimer` | `string` | `'20'` | Seconds per question |
| `submitting` | `boolean` | `false` | Submit in progress |
| `error` | `string` | `''` | Error message |

### API Calls

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/quizzes/` | Create new topic |

### Styling
- Inline style objects: `overlayStyle`, `modalStyle`, `rowStyle`, `gridStyle`, `actionsStyle`, `inputStyle`, `errorStyle`

---

## Component: ModalChooseQuestionType

### Location
`src/components/ModalChooseQuestionType.jsx`

### Type
- **UI Component (Modal)**

### Description
Modal for selecting question type when creating a new question. Offers single correct answer or multiple correct answers options.

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `onSelect` | `function` | No | - | Callback with type (`'single'` or `'multiple'`) |
| `onClose` | `function` | No | - | Close callback |

### State (local)
None (stateless)

### Styling
- Inline style objects: `overlayStyle`, `modalStyle`, `actionsStyle`, `buttonBase`

---

## Component: QuestionCreateForm

### Location
`src/components/QuestionCreateForm.jsx`

### Type
- **Feature Component**

### Description
Form component for creating new questions. Displays question text input and four answer options with checkboxes for marking correct answers.

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `cf` | `object` | Yes | - | Create form state object |
| `styles` | `object` | Yes | - | Style objects |
| `questionType` | `string` | Yes | - | `'single'` or `'multiple'` |
| `onChangeText` | `function` | Yes | - | Question text change handler |
| `onChangeOptionText` | `function` | Yes | - | Option text change handler |
| `onToggleOption` | `function` | Yes | - | Correct answer toggle handler |
| `onCancel` | `function` | Yes | - | Cancel callback |
| `onCreate` | `function` | Yes | - | Create callback |

### State (local)
None (controlled component)

---

## Component: QuestionEditCard

### Location
`src/components/QuestionEditCard.jsx`

### Type
- **Feature Component**

### Description
Card component for editing existing questions. Shows question text, answer options, and action buttons (save, cancel, delete).

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `q` | `object` | Yes | - | Question data |
| `styles` | `object` | Yes | - | Style objects |
| `dirty` | `boolean` | Yes | - | Has unsaved changes |
| `saving` | `boolean` | Yes | - | Save in progress |
| `savedMsg` | `string` | Yes | - | Save success message |
| `errors` | `object` | Yes | - | Validation errors |
| `deleting` | `boolean` | Yes | - | Delete in progress |
| `deleteError` | `string` | Yes | - | Delete error message |
| `onChangeText` | `function` | Yes | - | Question text change handler |
| `onChangeOptionText` | `function` | Yes | - | Option text change handler |
| `onToggleOption` | `function` | Yes | - | Correct answer toggle |
| `onSave` | `function` | Yes | - | Save callback |
| `onDelete` | `function` | Yes | - | Delete callback |
| `onCancelChanges` | `function` | Yes | - | Reset to original |

---

## Component: TopicHeader

### Location
`src/components/TopicHeader.jsx`

### Type
- **UI Component**

### Description
Header component for the topic editor page. Displays the topic ID and delete button with error handling.

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `id` | `number` | Yes | - | Topic ID |
| `deleting` | `boolean` | Yes | - | Delete in progress |
| `error` | `string` | Yes | - | Error message |
| `onDelete` | `function` | Yes | - | Delete callback |

---

# STEP 3 — PAGES & ROUTING

## Route Configuration

### Router Setup

**File**: `src/main.jsx`

```jsx
<BrowserRouter>
  <App />
</BrowserRouter>
```

### Routes Definition

**File**: `src/App.jsx`

| Path | Component | Auth Required | Description |
|------|-----------|---------------|-------------|
| `/` | `TopicsPage` | Yes | Main topics list |
| `/topic/:id` | `TopicPage` | Yes | Topic editor |
| `/teacher/session/:sessionId` | `TeacherSessionPage` | Yes | Live quiz session |
| `*` | `<Navigate to="/" />` | Yes | Catch-all redirect |

### Authentication Flow

```jsx
function App() {
  const [isAuthed, setIsAuthed] = useState(() => {
    const raw = localStorage.getItem('token')
    return Boolean(raw && raw !== 'undefined' && raw !== 'null' && raw.trim() !== '')
  })

  if (!isAuthed) {
    return <AuthPage onAuth={() => setIsAuthed(true)} />
  }

  return <Routes>...</Routes>
}
```

**Authentication Guard Logic**:
1. Check localStorage for `token`
2. Validate token is not empty, "undefined", "null", or whitespace
3. If invalid: render `AuthPage`
4. If valid: render protected routes

---

## Navigation Guards

### Token Validation
- **Location**: `src/App.jsx:10-13`
- **Checks**: Token exists, not literal "undefined"/"null", not empty after trim
- **Action**: Show `AuthPage` if invalid

### API-Level Guards
- **Location**: `src/api/client.js`
- **401 Response**: Calls `handleLogout()` - clears tokens, redirects to `/`
- **403 Response**: Attempts token refresh, retries request

---

## Route Parameters

| Route | Parameter | Type | Description |
|-------|-----------|------|-------------|
| `/topic/:id` | `id` | `string` | Topic/quiz ID (converted to number) |
| `/teacher/session/:sessionId` | `sessionId` | `string` | Session UUID/ID |

### Parameter Usage

**TopicPage**:
```jsx
const { id: idParam } = useParams()
const id = Number(idParam)
```

**TeacherSessionPage**:
```jsx
const { sessionId } = useParams()
```

---

## Navigation State

**Session Creation Flow**:
When starting a test, navigation state is passed:

```jsx
navigate(`/teacher/session/${session_id}`, {
  state: { code, topic, question_count }
})
```

**Consuming State**:
```jsx
const location = useLocation()
const { code: initialCode, topic, question_count } = location.state || {}
```

---

## Page: AuthPage

### Route
Not a route (rendered when `!isAuthed`)

### Purpose
User authentication via email/password login.

### Layout
Standalone centered card layout

### Data Requirements
None (entry point)

### User Flows

```
1. User enters email
2. User enters password
3. User clicks "Войти" (Login)
4. System validates fields
5. System sends POST /api/auth/login/
6. On success:
   - Store tokens in localStorage
   - Invoke onAuth callback
   - App re-renders with routes
7. On failure:
   - Display error message
   - Show field-specific errors
```

---

## Page: TopicsPage

### Route
`/`

### Purpose
Main dashboard for viewing and managing quiz topics.

### Layout
- Header with user avatar, name, logout button
- Grid of topic cards
- Add new topic button
- Create topic modal (conditional)
- Session creation loading modal (conditional)

### Data Requirements
- User info from localStorage
- Topics list from API
- Socket.IO connection for session creation

### User Flows

**View Topics**:
```
1. Page loads
2. Fetch /api/quizzes/
3. Display topic cards in grid
4. Show loading skeletons while fetching
```

**Create Topic**:
```
1. Click "+" card
2. Modal opens
3. Fill title, description, timer
4. Submit form
5. Navigate to /topic/{id}
```

**Start Quiz Session**:
```
1. Click "Начать тест" on topic card
2. Show loading modal
3. Emit teacher:create_session
4. Wait for teacher:session_created
5. Navigate to /teacher/session/{id}
```

---

## Page: TopicPage

### Route
`/topic/:id`

### Purpose
Edit quiz topic metadata and manage questions.

### Layout
- Topic header with delete button
- Form fields (title, description, timer)
- Save button (shown when dirty)
- Questions list
- Question create forms
- Add question button
- Question type modal (conditional)

### Data Requirements
- Topic ID from URL
- Topic data from API (including questions)

### User Flows

**Edit Topic**:
```
1. Modify title/description/timer
2. Save button appears
3. Click save
4. PATCH /api/quizzes/{id}/
5. Show success message
```

**Create Question**:
```
1. Click "Добавить вопрос"
2. Select question type (single/multiple)
3. Fill question text and options
4. Mark correct answer(s)
5. Click "Создать вопрос"
6. POST /api/topics/{id}/questions/
7. Question appears in list
```

**Edit Question**:
```
1. Modify question text or options
2. Save/Cancel buttons appear
3. Click save
4. PATCH /api/questions/{id}/
5. Show success message
```

**Delete Question**:
```
1. Click "Удалить вопрос"
2. DELETE /api/questions/{id}/delete/
3. Question removed from list
```

---

## Page: TeacherSessionPage

### Route
`/teacher/session/:sessionId`

### Purpose
Manage live quiz session - lobby, quiz execution, results.

### Layout
**Lobby Mode**:
- Session code display
- Topic info (title, description, question count, timer)
- Start button (disabled until students join)
- Connected students list

**Quiz Mode**:
- Mini header with code and student count
- TeacherQuizView component

### Data Requirements
- Session ID from URL
- Initial data from navigation state (optional)
- Real-time data via Socket.IO

### User Flows

**Session Lobby**:
```
1. Display session code
2. Listen for student joins/leaves
3. Update student list in real-time
4. Enable start button when students > 0
```

**Start Quiz**:
```
1. Click "Начать тест"
2. Emit teacher:start_session
3. Wait for session:started
4. Switch to quiz view
```

**Question Flow**:
```
1. Receive session:question
2. Display question and timer
3. Show answer count updates
4. Timer counts down
5. Timer expires → show "Время вышло"
6. Receive ranking data
7. Display results
8. Click "Следующий вопрос"
9. Repeat until quiz_finished
```

**Quiz Completed**:
```
1. Receive quiz_finished
2. Display final results
3. Show winners and scoreboard
4. Click "Вернуться на главную"
```

---

# STEP 4 — STATE MANAGEMENT

## Store Structure

This application uses **React Hooks** for state management without a centralized store (no Redux, Zustand, or Context API).

### State Categories

| Category | Location | Persistence |
|----------|----------|-------------|
| Authentication | localStorage | Persistent |
| User Info | localStorage | Persistent |
| Page Data | Component state | Session |
| Form State | Component state | Session |
| Real-time State | Custom hook | Session |

---

## Authentication State

### Storage Keys

| Key | Type | Description |
|-----|------|-------------|
| `token` | `string` | JWT access token |
| `refresh` | `string` | JWT refresh token |
| `user` | `string` (JSON) | User object |

### Token Management Functions

**File**: `src/api/client.js`

```javascript
const getToken = () => localStorage.getItem('token')

const storeTokens = (token, refresh) => {
  if (token) localStorage.setItem('token', token)
  if (refresh) localStorage.setItem('refresh', refresh)
}

const clearTokens = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('refresh')
}

export const handleLogout = () => {
  clearTokens()
  window.location.assign('/')
}
```

### Token Refresh Flow

```javascript
export const refreshToken = async () => {
  const refresh = localStorage.getItem('refresh')
  if (!refresh) {
    handleLogout()
    throw new Error('No refresh token')
  }

  const response = await api.post('/api/auth/refresh/', { refreshToken: refresh })
  // Handle response codes 401, 403
  storeTokens(result?.token, result?.refresh)
  return result?.token
}
```

---

## Custom Hook: useTeacherSession

### Location
`src/hooks/useTeacherSession.js`

### Purpose
Complete state management for teacher quiz sessions including Socket.IO event handling.

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `sessionId` | `string` | Session identifier |

### Return Value

```typescript
{
  // Lobby state
  students: Student[],
  sessionCode: string,
  loading: boolean,
  error: string,
  isStarted: boolean,
  isStarting: boolean,
  startSession: () => void,

  // Quiz state
  currentQuestion: Question | null,
  answerCount: { answered: number, total: number },
  timeLeft: number,
  showResults: boolean,
  ranking: Player[],
  isQuizFinished: boolean,
  finalResults: FinalResults | null,
  isLoadingNext: boolean,
  timerExpired: boolean,
  nextQuestion: () => void,
  finishSession: () => void,
}
```

### Internal State

| State | Type | Initial | Description |
|-------|------|---------|-------------|
| `students` | `array` | `[]` | Connected students |
| `sessionCode` | `string` | `''` | Session join code |
| `loading` | `boolean` | `true` | Initial loading |
| `error` | `string` | `''` | Error message |
| `isStarted` | `boolean` | `false` | Quiz started |
| `isStarting` | `boolean` | `false` | Starting in progress |
| `currentQuestion` | `object\|null` | `null` | Current question |
| `answerCount` | `object` | `{ answered: 0, total: 0 }` | Answer statistics |
| `timeLeft` | `number` | `0` | Remaining seconds |
| `showResults` | `boolean` | `false` | Show results view |
| `ranking` | `array` | `[]` | Player rankings |
| `isQuizFinished` | `boolean` | `false` | Quiz complete |
| `finalResults` | `object\|null` | `null` | Final results |
| `isLoadingNext` | `boolean` | `false` | Loading next question |
| `timerExpired` | `boolean` | `false` | Timer expired |

### Timer Management

```javascript
const timerRef = useRef(null)

useEffect(() => {
  if (timeLeft > 0 && !showResults) {
    timerRef.current = setTimeout(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)
  }
  return () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }
}, [timeLeft, showResults])
```

### Socket Event Handlers

| Event | Handler | State Updates |
|-------|---------|---------------|
| `session:state` | `handleSessionState` | students, sessionCode, loading |
| `session:error` | `handleError` | error, loading, isStarting, isLoadingNext |
| `session:student_joined` | `handleStudentJoined` | students (add) |
| `session:student_left` | `handleStudentLeft` | students (remove) |
| `session:started` | `handleSessionStarted` | isStarted, isStarting |
| `session:question` | `handleQuestion` | currentQuestion, timeLeft, showResults, timerExpired, answerCount, isLoadingNext |
| `session:answer_count` | `handleAnswerCount` | answerCount |
| `session:timer_expired` | `handleTimerExpired` | timerExpired, timeLeft |
| `session:question_closed` | `handleQuestionClosed` | timeLeft, showResults |
| `ranking` / `session:ranking` | `handleRanking` | ranking, showResults, timerExpired, timeLeft |
| `quiz_finished` / `session:quiz_finished` | `handleQuizFinished` | isQuizFinished, finalResults, showResults, currentQuestion |

---

## Form State Patterns

### Simple Form (AuthPage)

```javascript
const [form, setForm] = useState({ email: '', password: '' })

const onChange = (e) => {
  const { name, value } = e.target
  setForm((prev) => ({ ...prev, [name]: value }))
}
```

### Complex Form with Dirty Checking (TopicPage)

```javascript
// Original data for comparison
const [initial, setInitial] = useState(null)
const [form, setForm] = useState({ title: '', description: '', question_timer: '' })

// Baseline for dirty checking
const [baselineQuestions, setBaselineQuestions] = useState({})

// Check if form has changes
const buildPatch = () => {
  const payload = {}
  if (initial?.title !== form.title) payload.title = form.title
  // ... more comparisons
  return payload
}

// Only show save button if dirty
{Object.keys(buildPatch()).length > 0 && <button>Save</button>}
```

### Multiple Form Instances (Question Create Forms)

```javascript
const [createForms, setCreateForms] = useState([])

const addCreateForm = (type) => {
  setCreateForms(prev => ([
    ...prev,
    {
      key: Date.now() + Math.random(),
      text: '',
      options: Array.from({ length: 4 }).map(() => ({ text: '', is_correct: false })),
      questionType: type,
    }
  ]))
}
```

---

## Loading State Patterns

### Per-Item Loading Maps

```javascript
const [savingMap, setSavingMap] = useState({})   // { [questionId]: boolean }
const [deletingMap, setDeletingMap] = useState({}) // { [questionId]: boolean }

// Usage
setSavingMap(m => ({ ...m, [questionId]: true }))
// ... async operation
setSavingMap(m => ({ ...m, [questionId]: false }))
```

### Fetch-Once Pattern

```javascript
const didFetchRef = useRef(false)

useEffect(() => {
  if (didFetchRef.current) return
  didFetchRef.current = true

  // ... fetch data
}, [])
```

---

# API Integration

## API Clients

### Primary Client (client.js)

**Location**: `src/api/client.js`

**Features**:
- Axios instance with base URL
- Automatic token attachment
- Token refresh on 403
- Logout on 401
- Error message extraction

```javascript
export const apiRequest = async (method, url, data, config = {}) => {
  const headers = { ...(config.headers || {}) }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await api.request({ method, url, data, ...config, headers })
  // Handle response codes
  return result ?? response.data
}
```

### Secondary Client (request.js)

**Location**: `src/api/request.js`

**Features**:
- Simplified response format
- Returns `{ success, result, message }` or `{ success, fields, message }`
- No automatic token refresh

```javascript
export const request = async (method, url, data) => {
  const response = await client.request({ method, url, data, headers: {...} })

  if (success === true) {
    return { success: true, result: normalized, message }
  }
  return { success: false, fields: result ?? {}, message }
}
```

---

## API Endpoints

| Method | Endpoint | Used By | Purpose |
|--------|----------|---------|---------|
| POST | `/api/auth/login/` | AuthPage | User login |
| POST | `/api/auth/refresh/` | client.js | Refresh token |
| GET | `/api/quizzes/` | TopicsPage, MainPage | List all quizzes |
| POST | `/api/quizzes/` | CreateTopicModal | Create quiz |
| GET | `/api/quizzes/{id}/` | TopicPage | Get quiz with questions |
| PATCH | `/api/quizzes/{id}/` | TopicPage | Update quiz metadata |
| DELETE | `/api/quizzes/{id}/` | TopicPage | Delete quiz |
| POST | `/api/topics/{id}/questions/` | TopicPage | Create question |
| PATCH | `/api/questions/{id}/` | TopicPage | Update question |
| DELETE | `/api/questions/{id}/delete/` | TopicPage | Delete question |

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://127.0.0.1:8000` | Backend API base URL |
| `VITE_SOCKET_URL` | `http://127.0.0.1:8000` | Socket.IO server URL |

---

# Socket.IO Real-Time Layer

## Configuration

**Location**: `src/api/socket.js`

```javascript
const SOCKET_URL = import.meta.env?.VITE_SOCKET_URL || 'http://127.0.0.1:8000'

const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket', 'polling'],
})

export const connectSocket = () => {
  const token = localStorage.getItem('token')
  if (token) socket.auth = { token }
  if (!socket.connected) socket.connect()
}

export const disconnectSocket = () => {
  if (socket.connected) socket.disconnect()
}
```

---

## Socket Events Reference

### Teacher Emits (Client → Server)

| Event | Payload | Description |
|-------|---------|-------------|
| `teacher:create_session` | `{ topic_id }` | Create new session |
| `teacher:join_session` | `{ session_id }` | Join existing session |
| `teacher:start_session` | `{ session_id }` | Start the quiz |
| `teacher:next_question` | `{ session_id }` | Load next question |
| `teacher:finish_session` | `{ session_id }` | End session early |
| `teacher:leave_session` | `{ session_id }` | Leave session |

### Server Emits (Server → Client)

| Event | Payload | Description |
|-------|---------|-------------|
| `teacher:session_created` | `{ session_id, code, topic, question_count }` | Session created |
| `teacher:session_error` | `{ message }` | Session creation failed |
| `session:state` | `{ students, code }` | Initial session state |
| `session:error` | `{ message }` | Session error |
| `session:student_joined` | `{ student }` | Student connected |
| `session:student_left` | `{ student_id, sid }` | Student disconnected |
| `session:started` | `{ session_id }` | Quiz started |
| `session:question` | `{ text, options, time, ... }` | New question |
| `session:answer_count` | `{ answered, total }` | Answer statistics |
| `session:timer_expired` | - | Time ran out |
| `session:question_closed` | - | Question ended |
| `ranking` / `session:ranking` | `Player[]` or `{ players }` | Rankings after question |
| `quiz_finished` / `session:quiz_finished` | `{ winners, scoreboard }` | Quiz completed |

---

## Debug Logging

The hook enables debug logging for all socket events:

```javascript
socket.onAny((eventName, ...args) => {
  console.log('[Socket Event]', eventName, args)
})
```

---

# User Flows

## Complete Teacher Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                        TEACHER FLOW                               │
└──────────────────────────────────────────────────────────────────┘

1. LOGIN
   ┌─────────────┐     POST /api/auth/login/     ┌─────────────┐
   │  AuthPage   │ ─────────────────────────────▶│   Backend   │
   │             │◀───────────────────────────── │             │
   └─────────────┘  { token, refresh, user }     └─────────────┘
         │
         │ Store tokens in localStorage
         ▼
2. VIEW TOPICS
   ┌─────────────┐     GET /api/quizzes/         ┌─────────────┐
   │ TopicsPage  │ ─────────────────────────────▶│   Backend   │
   │             │◀───────────────────────────── │             │
   └─────────────┘        [topics]               └─────────────┘
         │
         │ Click "Начать тест"
         ▼
3. CREATE SESSION
   ┌─────────────┐  teacher:create_session       ┌─────────────┐
   │ TopicsPage  │ ═════════════════════════════▶│  Socket.IO  │
   │             │◀═════════════════════════════ │   Server    │
   └─────────────┘ teacher:session_created       └─────────────┘
         │
         │ Navigate to session page
         ▼
4. SESSION LOBBY
   ┌─────────────┐  teacher:join_session         ┌─────────────┐
   │TeacherSession│ ════════════════════════════▶│  Socket.IO  │
   │    Page     │◀════════════════════════════ │   Server    │
   └─────────────┘     session:state             └─────────────┘
         │
         │ Real-time student updates
         │ (session:student_joined/left)
         │
         │ Click "Начать тест"
         ▼
5. START QUIZ
   ┌─────────────┐  teacher:start_session        ┌─────────────┐
   │TeacherSession│ ════════════════════════════▶│  Socket.IO  │
   │    Page     │◀════════════════════════════ │   Server    │
   └─────────────┘     session:started           └─────────────┘
         │
         ▼
6. QUESTION LOOP
   ┌─────────────┐     session:question          ┌─────────────┐
   │TeacherQuiz  │◀════════════════════════════ │  Socket.IO  │
   │    View     │                               │   Server    │
   └─────────────┘                               └─────────────┘
         │
         │ Display question, start timer
         │ Real-time answer count updates
         │ Timer expires or all answered
         ▼
   ┌─────────────┐  session:timer_expired        ┌─────────────┐
   │TeacherQuiz  │◀════════════════════════════ │  Socket.IO  │
   │    View     │                               │   Server    │
   └─────────────┘                               └─────────────┘
         │
         │ Receive rankings
         ▼
   ┌─────────────┐     ranking/session:ranking   ┌─────────────┐
   │TeacherQuiz  │◀════════════════════════════ │  Socket.IO  │
   │    View     │                               │   Server    │
   └─────────────┘                               └─────────────┘
         │
         │ Click "Следующий вопрос"
         ▼
   ┌─────────────┐  teacher:next_question        ┌─────────────┐
   │TeacherQuiz  │ ════════════════════════════▶│  Socket.IO  │
   │    View     │                               │   Server    │
   └─────────────┘                               └─────────────┘
         │
         │ Repeat until no more questions
         ▼
7. QUIZ FINISHED
   ┌─────────────┐     quiz_finished             ┌─────────────┐
   │TeacherQuiz  │◀════════════════════════════ │  Socket.IO  │
   │    View     │                               │   Server    │
   └─────────────┘                               └─────────────┘
         │
         │ Display final results
         │ Click "Вернуться на главную"
         ▼
   ┌─────────────┐
   │ TopicsPage  │
   └─────────────┘
```

---

## Data Flow Diagrams

### Authentication Data Flow

```
User Input              AuthPage State           localStorage           App State
─────────               ──────────────           ────────────           ─────────
email, password  ────▶  form state
                              │
                              ▼
                        POST /api/auth/login/
                              │
                              ▼
                        response.data ─────────▶ token, refresh, user
                              │                          │
                              ▼                          ▼
                        onAuth() ───────────────────────▶ isAuthed = true
```

### Quiz Session Data Flow

```
Socket.IO Events        useTeacherSession Hook       TeacherQuizView Props
────────────────        ──────────────────────       ────────────────────
session:question ────▶  currentQuestion ────────────▶ currentQuestion
                        timeLeft ───────────────────▶ timeLeft

session:answer_count ─▶ answerCount ────────────────▶ answerCount

session:timer_expired ▶ timerExpired ───────────────▶ timerExpired

ranking ──────────────▶ ranking ────────────────────▶ ranking
                        showResults ────────────────▶ showResults

quiz_finished ────────▶ isQuizFinished ─────────────▶ isQuizFinished
                        finalResults ───────────────▶ finalResults
```

---

# Styling Architecture

## CSS Files

| File | Purpose | Scope |
|------|---------|-------|
| `src/index.css` | Base reset, typography, box-sizing | Global |
| `src/App.css` | Auth forms, layout, cards, grids | Global classes |

## Styling Approaches

### 1. External CSS (Global Classes)
Used for: Layout, authentication, common patterns

```css
/* App.css */
.main-page { min-height: 100vh; display: flex; }
.auth-card { width: min(420px, 90vw); }
```

### 2. Inline Style Objects
Used for: Page-level layouts, component-specific styles

```javascript
const pageStyle = {
  minHeight: '100vh',
  display: 'flex',
  background: 'linear-gradient(180deg, #f8fbff 0%, #eef2ff 100%)',
}
```

### 3. Inline `<style>` Tags (Scoped CSS)
Used for: Complex component styles with hover/focus states

```jsx
<style>{`
  .topic-card-wrap:hover { transform: scale(1.02); }
  .topic-card-glow { filter: blur(16px); opacity: 0.55; }
`}</style>
```

### 4. Dynamic Inline Styles
Used for: Conditional styling, computed values

```javascript
const timerCircleStyle = (timeLeft, totalTime) => ({
  background: `conic-gradient(${color} ${percentage}%, #e2e8f0 ${percentage}%)`,
})
```

## Design Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| Primary Blue | `#2563eb` | Buttons, links, accents |
| Primary Blue Dark | `#1d4ed8` | Gradients, hover states |
| Success Green | `#10b981` | Start buttons, correct answers |
| Error Red | `#ef4444` | Delete buttons, errors |
| Warning Amber | `#f59e0b` | Timer warnings, rankings |
| Text Primary | `#0f172a` | Headings, important text |
| Text Secondary | `#64748b` | Descriptions, labels |
| Border | `#e2e8f0` | Input borders, dividers |
| Background | `#f8fbff` | Page backgrounds |

### Spacing & Sizing

| Element | Value |
|---------|-------|
| Border Radius (Cards) | `18px` |
| Border Radius (Buttons) | `10px-12px` |
| Border Radius (Inputs) | `8px-10px` |
| Card Padding | `20px-24px` |
| Grid Gap | `12px-20px` |

---

# Assumptions & Notes

## Assumptions

1. **Backend API Structure**: Assumes REST API returns `{ success, result, message }` format
2. **Authentication**: Assumes JWT-based auth with access and refresh tokens
3. **Socket.IO Server**: Assumes server handles both namespaced (`session:*`) and non-namespaced events
4. **Question Structure**: Assumes questions have 4 options (based on create form initialization)
5. **User Object**: Assumes user has `first_name`, `last_name`, `email` fields

## Notes

1. **MainPage vs TopicsPage**: `MainPage` appears to be legacy; `TopicsPage` is the active implementation
2. **Event Naming**: Socket events have dual naming (`ranking` and `session:ranking`) for compatibility
3. **No TypeScript**: Project uses JSX with TypeScript definitions for IDE support only
4. **No Testing**: No test files or testing framework detected
5. **No i18n**: UI text is in Russian (hardcoded)
6. **No Error Boundary**: No React error boundaries implemented

---

*Document generated based on codebase analysis. Last updated: December 11, 2025*
