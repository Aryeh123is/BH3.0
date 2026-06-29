# VOCARIOX — PAST PAPER INTELLIGENCE SYSTEM (v4.0.3)
## Production Technical Specification

## 1. Architecture Summary
The Vocariox Past Paper Intelligence System is a specialized metadata and analytics layer designed to facilitate official exam paper discovery and self-grading. The system is architected to be strictly **Copyright-Safe**, meaning it functions as a relational metadata store that points to official institutional resources rather than hosting or serving copyrighted exam content.

## 2. Copyright Compliance Model
- **No Hosting**: No PDF, image, or text content from exam boards is stored within the Vocariox infrastructure.
- **No Proxying/Embedding**: The application is forbidden from using iframes, PDF.js, or any embedding technology to display exam materials.
- **Official Navigation**: Users are redirected to verified exam board domains (e.g., `filestore.aqa.org.uk`, `qualifications.pearson.com`) for content access.
- **Metadata-Only Storage**: Internal records contain only public-domain descriptors (Year, Tier, Board) and navigation URLs.

## 3. Data Model (Firestore)

### Collection: `/pastPapers/{paperId}`
| Field | Type | Description |
| :--- | :--- | :--- |
| `paperId` | `string` | **Deterministic Primary Key** (Board_Subject_Tier_Year_P#) |
| `examBoard` | `string` | AQA, Edexcel, OCR, Eduqas, etc. |
| `subject` | `string` | Spanish, French, German, etc. |
| `tier` | `string` | `Foundation` | `Higher` |
| `year` | `number` | Four-digit exam series year. |
| `paperNumber` | `number` | Paper sequence number (1, 2, 3, etc.). |
| `totalMarks` | `number` | Maximum raw possible marks. |
| `paperUrl` | `string` | **External URL** to official PDF Question Paper. |
| `markSchemeUrl`| `string` | **External URL** to official PDF Mark Scheme. |
| `examinerReportUrl` | `string` | (Optional) **External URL** to official examiner report PDF. |

### Collection: `/gradeBoundaries/{boundaryId}`
- **ID Format**: `{examBoard}_{subject}_{tier}_{year}`
- **Structure**:
```typescript
{
  boundaryId: string,
  boundaries: {
    "9": 52,
    "8": 46,
    "7": 40,
    ...
  }
}
```

### Collection: `/users/{uid}/paperResults/{paperId}`
- **Structure**: Stores `score`, `percentage`, `grade`, and `timestamp`.

## 4. Paper Identification System
The system relies on a **Deterministic Composite Identity (DCI)**. This ensures that every system component (Grading, Analytics, UI) can resolve the same object without database lookups using only metadata context.

**Format**: `{BOARD}_{SUBJECT}_{TIER}_{YEAR}_P{NUMBER}`
**Example**: `AQA_SPANISH_HIGHER_2023_P1`

## 5. Grading Engine Logic
The engine is strictly deterministic and rule-based.

### Calculation Algorithm (Pseudocode):
```typescript
function calculateGrade(score, totalMarks, boundaries) {
  // 1. Validate Input
  if (score > totalMarks) throw Error("Score exceeds Paper Max");
  
  // 2. Sort Boundaries
  const sorted = sortDescending(boundaries); // [ {g: '9', m: 50}, {g: '8', m: 45}... ]
  
  // 3. Match Grade
  for (const entry of sorted) {
    if (score >= entry.marks) return entry.grade;
  }
  
  return 'U'; // Ungraded
}
```

## 6. Logic Flow
1. **Selection**: User filters metadata (Board/Subject/Tier).
2. **Access**: User clicks "Open Official Paper" -> Redirected to official external PDF.
3. **Completion**: User completes paper externally and marks using the provided official Mark Scheme link.
4. **Input**: User returns to Vocariox and inputs their Raw Score.
5. **Execution**: System performs DCI lookup for Grade Boundaries and executes the Grading Engine.
6. **Retention**: Results are persisted to the user's private history for longitudinal tracking.

## 7. Indexing Strategy
To ensure maximum query efficiency, the following indexes are required:
- `subject` (Asc) + `examBoard` (Asc) + `year` (Desc)
- `userId` (Asc) + `timestamp` (Desc) [User Results]

## 8. Scalability & Maintenance
- **Deterministic IDs**: Allow for batch imports without duplicate key risks.
- **Relational Independence**: Adding new subjects or boards requires only metadata population, zero code changes.
- **State Isolation**: Content availability depends on external boards, reducing Vocariox maintenance overhead for broken links.
