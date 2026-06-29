import { 
  ExamEvent, 
  TranscriptSegment, 
  AIEvaluationPayload, 
  ExamSession
} from '../types/speaking-engine';

/**
 * Audio -> Transcript Pipeline Design (Mock/Stub for MVP)
 * 
 * Step 1: Upload `audioBlobUrl` (which would be an actual Blob in production) to a transcription
 *         service (e.g., Google Cloud Speech-to-Text, Whisper API).
 * Step 2: The transcription service returns word-level or sentence-level timestamps.
 * Step 3: We align those timestamped transcripts with our deterministic `eventLog`.
 */

export interface RawTranscriptWord {
  word: string;
  startTime: number; // in milliseconds from start of recording
  endTime: number;   // in milliseconds from start of recording
}

/**
 * Simulates receiving transcription back from an API for a specific Audio chunk.
 * In a real backend worker, this would call an external API.
 */
export async function mockTranscribeAudio(audioRef: string): Promise<RawTranscriptWord[]> {
  // Mock words spanning a short duration
  return [
    { word: "Hola,", startTime: 0, endTime: 500 },
    { word: "me", startTime: 500, endTime: 800 },
    { word: "llamo", startTime: 800, endTime: 1200 },
    { word: "estudiante.", startTime: 1200, endTime: 2000 },
  ];
}

/**
 * EventLog -> Transcript Alignment Logic
 * 
 * Maps raw word-level transcripts into `TranscriptSegment`s, breaking them
 * based on contextual events like `FOLLOWUP_REVEALED` to ensure AI knows EXACTLY
 * what the user saw when speaking.
 */
export function alignTranscriptToEvents(
  taskId: string,
  recordingStartTimeIso: string,
  rawWords: RawTranscriptWord[],
  sessionEvents: ExamEvent[]
): TranscriptSegment[] {
  const recordingStartTime = new Date(recordingStartTimeIso).getTime();
  
  // Filter events relevant to this specific task and occurring during this recording
  const taskEvents = sessionEvents.filter(e => 
    (e as any).taskId === taskId && 
    new Date(e.timestamp).getTime() >= recordingStartTime
  );

  const segments: TranscriptSegment[] = [];
  let currentSegmentWords: string[] = [];
  let currentSegmentStart = recordingStartTime;
  let currentLinkedEvents: string[] = [
    taskEvents.find(e => e.type === 'RECORDING_STARTED')?.type || 'RECORDING_STARTED'
  ];

  for (const word of rawWords) {
    const wordAbsoluteTime = recordingStartTime + word.startTime;
    
    // Check if any major event happened just before this word (e.g. Follow-up revealed)
    const recentlyPassedEvents = taskEvents.filter(e => {
       const eventTime = new Date(e.timestamp).getTime();
       // If event happened after current segment started, and before/during this word
       return eventTime > currentSegmentStart && eventTime <= wordAbsoluteTime;
    });

    if (recentlyPassedEvents.length > 0) {
      // Split the segment because the context changed (e.g. user saw a new prompt)
      if (currentSegmentWords.length > 0) {
        segments.push({
          segmentId: crypto.randomUUID(),
          taskId,
          startTimestamp: new Date(currentSegmentStart).toISOString(),
          endTimestamp: new Date(wordAbsoluteTime).toISOString(), // End roughly now
          text: currentSegmentWords.join(' '),
          linkedEventIds: [...currentLinkedEvents] // events that led up to this segment
        });
        currentSegmentWords = [];
      }
      currentSegmentStart = wordAbsoluteTime;
      // Gather contextual event IDs for the next segment
      currentLinkedEvents = recentlyPassedEvents.map((e: any) => e.type === 'FOLLOWUP_REVEALED' ? `FOLLOWUP_${e.questions.join('_')}` : e.type);
    }

    currentSegmentWords.push(word.word);
  }

  // Push final segment
  if (currentSegmentWords.length > 0) {
    segments.push({
      segmentId: crypto.randomUUID(),
      taskId,
      startTimestamp: new Date(currentSegmentStart).toISOString(),
      endTimestamp: new Date(recordingStartTime + rawWords[rawWords.length - 1].endTime).toISOString(),
      text: currentSegmentWords.join(' '),
      linkedEventIds: [...currentLinkedEvents]
    });
  }

  return segments;
}

/**
 * Builds the AI Evaluation Payload for a specific task.
 */
export function buildAIEvaluationPayload(
  taskId: string,
  session: ExamSession,
  taskSegments: TranscriptSegment[]
): AIEvaluationPayload {
  const eventContext = session.eventLog.filter((e: any) => e.taskId === taskId || e.type === 'PHASE_CHANGED');
  const fullTranscript = taskSegments.map(s => s.text).join(' ');

  return {
    taskId,
    transcript: fullTranscript,
    eventContext,
    timestampedSegments: taskSegments
  };
}
