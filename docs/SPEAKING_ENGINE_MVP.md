# 🗣️ Speaking Exam Engine: MVP Architecture

## 1. Simplified Folder Structure

```text
/src
  /types
    speaking-engine.ts           # Core schema interfaces & task types
  /data
    /speaking-schemas
      edexcel-spanish-higher.ts  # The MVP schema
    /content-bank                # Hardcoded MVP content
      mock-spanish-content.ts
  /components
    /speaking-engine
      SpeakingExamFlow.tsx       # Main state machine (React state)
      /tasks                     # Dumb presentational components
        ReadAloudTask.tsx
        RoleplayTask.tsx
        PhotoCardTask.tsx
        ConversationTask.tsx
        ThemeSelectorUI.tsx      # Simple 1-of-N choice UI
      /shared
        SimpleTimer.tsx          # Standalone timer hook/component
        AudioRecorder.tsx        # Pure media recorder UI
```

## 2. Simplified Frontend Architecture

- **State Management:** Pure React `useState` at the top level `SpeakingExamFlow` to track `currentIndex`, `answers`, and `selectedTheme`.
- **Dumb Tasks:** `ReadAloudTask`, `RoleplayTask`, etc., only receive `content`, `timeRemaining`, and an `onComplete(audioBlob)` callback.
- **Data Flow:**
  - Load Schema -> Render `SpeakingExamFlow`
  - Render Component based on `schema.sections[currentIndex].type`
  - Component calls `onComplete(data)`
  - Engine increments index, stores data
  - At length limit, handle submit

## 3. Simplified Backend Structure

- **Static Assets:** React frontend hosted on Cloudflare Pages.
- **Database (Supabase/Firebase):**
  - Table: `exam_schemas` (later: stores JSON schemas)
  - Table: `exam_attempts` (stores `user_id`, `schema_id`, `answers_json`, `status`)
  - Storage Bucket: `/recordings/{attempt_id}/{task_id}.webm`
- **Future AI Pipeline:** Webhook triggered on `exam_attempts` row update (status -> 'submitted').

## 4. Minimal Universal Schema Format

The schema dictates *what* to render and *how long* to give. It does NOT contain the actual text or images (that comes from the content bank).

```typescript
export type TaskType = 'theme_selection' | 'read_aloud' | 'photo_card' | 'roleplay' | 'conversation';

// Pure layout & rules
export interface ExamSectionSchema {
  id: string;             // e.g., 'sec_1_read_aloud'
  type: TaskType;         // Defines which React component to mount
  title: string;          // Display title
  prepSeconds: number;    // 0 if prep is shared/done
  activeSeconds: number;  // The actual speaking limit
  config: any;            // Lightweight config (e.g., optionsToShow: 2)
}

export interface ExamBoardSchema {
  id: string;
  board: string;
  language: string;
  tier: string;
  sections: ExamSectionSchema[];
}
```

## 5. Example Edexcel Spanish Higher Schema (Simplified)

```typescript
export const EdexcelSpanishHigherMVP: ExamBoardSchema = {
  id: 'edexcel-spanish-higher-2024',
  board: 'Edexcel',
  language: 'Spanish',
  tier: 'Higher',
  sections: [
    {
      id: 'selection',
      type: 'theme_selection',
      title: 'Choose your card',
      prepSeconds: 0,
      activeSeconds: 60,
      config: { cardsToPickFrom: 2 }
    },
    {
      id: 'read_aloud',
      type: 'read_aloud',
      title: 'Read Aloud passage',
      prepSeconds: 720, // 12 mins prep time starts here
      activeSeconds: 150,
      config: { includeFollowUps: true }
    },
    {
      id: 'roleplay',
      type: 'roleplay',
      title: 'Roleplay scenario',
      prepSeconds: 0, // Prep already done
      activeSeconds: 150,
      config: {}
    },
    {
      id: 'conversation',
      type: 'conversation',
      title: 'General Conversation',
      prepSeconds: 0,
      activeSeconds: 360,
      config: { themesToCover: 2 }
    }
  ]
};
```

## 6. Simple Content Relationship System

Instead of a complex graph, use flat references:

```typescript
export interface BaseContent {
  id: string;
  themeId: string; // e.g., 'school_and_college'
}

export interface ReadAloudContent extends BaseContent {
  passage: string;
  followUpQuestionIds: string[]; // Simply points to ConversationQuestion records
}

export interface PhotoCardContent extends BaseContent {
  imageUrl: string;
  prompts: string[];
  followUpQuestionIds: string[];
}
```

When building the exam session, the engine simply fetches the records matching these IDs.

## 7. Example Task Data Models (Content Bank)

```typescript
export interface ConversationQuestion {
  id: string;
  themeId: string;
  questionText: string; // e.g., "¿Qué asignaturas estudias?"
  expectedKeywords?: string[]; // for future AI
}

export interface RoleplayPrompt {
  id: string;
  text: string;
  requiresQuestionFromStudent: boolean; // For the '?' tasks
}

export interface RoleplayContent extends BaseContent {
  studentInstructions: string;
  prompts: RoleplayPrompt[];
}
```

## 8. Simple Timing Implementation

A standalone React Hook. No Redux, no heavy intervals.

```typescript
function useExamTimer(totalSeconds: number, onComplete: () => void) {
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  
  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  return { timeLeft };
}
```

## 9. Simple Exam Flow Renderer

```tsx
function SpeakingExamFlow({ schema, contentBank }) {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  
  const currentSection = schema.sections[sectionIndex];
  
  const handleTaskComplete = (answerData) => {
    setAnswers([...answers, { sectionId: currentSection.id, ...answerData }]);
    
    if (sectionIndex === schema.sections.length - 1) {
       submitExam(answers);
    } else {
       setSectionIndex(sectionIndex + 1);
    }
  };

  return (
    <div>
      <Header currentTitle={currentSection.title} />
      
      {currentSection.type === 'read_aloud' && 
         <ReadAloudTask schema={currentSection} content={contentBank[currentSection.id]} onComplete={handleTaskComplete} />
      }
      {currentSection.type === 'roleplay' && 
         <RoleplayTask schema={currentSection} content={contentBank[currentSection.id]} onComplete={handleTaskComplete} />
      }
      {/* ... */}
    </div>
  )
}
```

## 10. Recommended React Architecture

- **Context-Free:** Pass data via props (`content`, `timing`, `onComplete`). It forces decoupled tasks.
- **Uncontrolled Audio:** The `AudioRecorder` component handles its own state (start, stop) and calls `onStop(blob)` which bubbles up to `handleTaskComplete()`.
- **Top-Down Logic:** The Flow component is the ONLY component that knows about the "Exam". The task components only know about "Displaying a Prompt and Recording".

## 11. Suggested Supabase/Firebase Collections

1. `exam_schema_configs` (id, language, board, json_schema)
2. `speaking_content_bank` (id, type, language, theme_id, json_content)
3. `speaking_attempts` (id, student_id, schema_id, created_at, status)
4. `speaking_answers` (id, attempt_id, section_id, task_type, audio_url, duration, transcript)
5. `speaking_feedback` (attempt_id, ai_json_marks)

## 12. Suggested Development Order

1. **Static Mock Objects:** Write `edexcel-spanish-higher.ts` and `mock-spanish-content.ts` with hardcoded arrays.
2. **Dumb UI Components:** Build `ReadAloudTask`, `RoleplayTask`, `PhotoCardTask` passing in the mock data directly. No recording yet.
3. **Timer Hook:** Implement `useExamTimer` inside the UI components.
4. **State Machine:** Build `SpeakingExamFlow` to navigate between the dummy tasks.
5. **Audio integration:** Build the `AudioRecorder` using browser `MediaRecorder` API and retrieve the blob.
6. **Submission Simulation:** Console.log the final `answers` array (with blobs) at the end of the exam.
