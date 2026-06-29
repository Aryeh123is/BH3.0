# 🗣️ Speaking Exam Engine Architecture

## 1. Recommended Folder Structure

```text
/src
  /types
    speaking-engine.ts      # Core interfaces, schemas, and task types
  /data
    /speaking-schemas       # Exam board schemas (e.g., edexcel-spanish.ts, aqa-german.ts)
    /content-bank           # Mock or static content items for tasks
  /components
    /speaking-engine
      UniversalEngine.tsx   # The main state machine and renderer
      SectionRenderer.tsx   # Routes the current section to the right task component
      /tasks
        ReadAloudTask.tsx
        PhotoCardTask.tsx
        RoleplayTask.tsx
        ConversationTask.tsx
        ThemeSelection.tsx  # For handling student choices (e.g. choosing 1 of 2 photo cards)
      /shared
        TimerBar.tsx
        AudioRecorder.tsx
        FollowUpQuestions.tsx
  /services
    /scoring
      ai-marker.ts          # AI evaluation services (post-submission)
```

## 2. Recommended Frontend Architecture

- **State Machine UI**: The engine acts as a pure state machine `(State, Action) -> State`. The state includes `currentSectionIndex`, `selectedThemes`, `answers (audio blobs or transcripts)`, and `timeRemaining`.
- **Dumb Components**: Task components (e.g., `PhotoCardTask`) are purely presentational. They receive the content (image, prompts), timing rules, and an `onComplete(recording)` callback.
- **Provider/Context**: `ExamEngineProvider` wraps the exam session, providing access to timers, themes chosen, and current progression without prop drilling.

## 3. Recommended Backend Architecture (Cloudflare Pages + Firebase/Supabase)

- **Static Assets & Hosting**: Cloudflare Pages for lightning-fast frontend delivery globally.
- **Database (Supabase/Firebase)**:
  - `schemas` collection (stores exam rules).
  - `content_bank` collection (stores individual tasks like a specific photo card).
  - `attempts` collection (stores student recordings, metadata).
- **Edge Functions (Cloudflare Workers or Firebase Functions)**:
  - Handles the API route for submitting the final attempt.
  - Triggers the async AI marking job (so the frontend doesn't timeout).
- **Blob Storage**: Cloudflare R2 or Firebase Storage for saving user audio recordings.

## 4. Universal Speaking Schema Format

```typescript
export type TaskType = 'theme_selection' | 'read_aloud' | 'photo_card' | 'roleplay' | 'conversation';

export interface TimingConfig {
  preparationSeconds: number;
  taskSeconds: number;
  allowsExtraTime: boolean; // e.g., SEN 25% extra time
}

export interface ExamSectionSchema {
  id: string; // e.g., 'section_1_photo_card'
  type: TaskType;
  title: string;
  timing: TimingConfig;
  config: Record<string, any>; // Specific rules (e.g., optionsCount: 2)
  linksToPreviousTheme?: boolean; // If true, fetches content based on earlier choices
}

export interface ExamBoardSchema {
  id: string; // 'edexcel-spanish-higher'
  board: 'Edexcel' | 'AQA';
  level: 'GCSE' | 'A-Level';
  language: string;
  tier: 'Foundation' | 'Higher';
  sections: ExamSectionSchema[];
}
```

## 5. Example Schema Files

See `src/data/speaking-schemas/` for concrete examples (Edexcel Spanish & AQA German).

## 6. Dynamic Flow Rendering System

The `UniversalEngine` holds an array of `ExamSectionSchema`. 
When the user clicks "Next" or time expires, the engine increments the index. 
```tsx
const currentSection = schema.sections[currentIndex];
<SectionRenderer section={currentSection} content={loadedContent} onComplete={handleNext} />
```
The renderer uses a Switch statement based on `currentSection.type` to render the correct UI component.

## 7. Reusable Task Component Design

Every task component implements a standard interface:
```typescript
interface BaseTaskProps {
  content: TaskContent;     // the text, images, prompts
  timing: TimingConfig;     // time limits (prep & active)
  onSaveAnswer: (ans: AnswerData) => void;
  onComplete: () => void;   // move to next section
}
```
This ensures zero exam-specific logic leaks into the UI.

## 8. Example Data Models

See `src/types/speaking-engine.ts`.

## 9. Example Schema Loader Logic

```typescript
async function startExam(board: string, tier: string, language: string) {
  // 1. Fetch schema from DB
  const schema = await fetchSchema(board, tier, language);
  // 2. Fetch required content from Content Bank to fulfil schema requirements
  const sessionContent = await fetchContentBankForSchema(schema);
  // 3. Initialize Universal Engine
  setEngineState({ schema, sessionContent, status: 'ready' });
}
```

## 10. Example Timing System

A global `useExamTimer(config: TimingConfig, isExtraTime: boolean)` hook.
- Manages `prepTime` vs `activeTime`.
- Yields warnings (e.g., 30 seconds remaining).
- Automatically triggers `onComplete()` when active time ends.

## 11. Linked Follow-up Question System

```json
{
  "contentId": "photo_card_001",
  "baseQuestion": "What do you see in the photo?",
  "followUps": [
    { "id": "fq1", "prompt": "And what did you do yesterday?", "linkedTheme": "holidays" }
  ]
}
```
The UI loads follow-ups sequentially based on the initial response or user clicks "Next Question".

## 12. Best Scalable Architecture (Cloudflare + Firebase/Supabase)

1. **Client**: Generates audio blobs. Uploads to Storage.
2. **Database**: Attaches Storage URLs to `AssessmentAttempt` row.
3. **Queue**: Submission triggers an async worker queue.
4. **AI Processing Worker**: 
   - Downloads audio.
   - Runs Whisper (Speech-to-Text).
   - Feeds transcript + schema criteria to Gemini/Claude.
   - Saves structured JSON marking to DB.
5. **Client**: Listens for DB updates (`onSnapshot`) and shows feedback when ready.

## 13. Suggested Development Order

1. **Phase 1: Types & Schemas**: Define `speaking-engine.ts` and create mock schemas. (We are doing this now).
2. **Phase 2: Dumb Components**: Build `PhotoCardTask`, `ReadAloudTask`, etc., with hardcoded mock content.
3. **Phase 3: Universal Engine**: Build the flow controller that reads a schema and stitches the components together.
4. **Phase 4: Media & State**: Integrate microphone access (MediaRecorder) and timer hooks.
5. **Phase 5: Content Bank integration**: Move hardcoded content into a structured database structure.
6. **Phase 6: AI Marking Pipeline**: Send submitted blobs to an AI backend for evaluation.
