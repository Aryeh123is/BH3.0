
import { ExamBoardSchema } from '../../types/speaking-engine';
import { EdexcelSpanishHigher } from './edexcel-spanish';
import { AqaGermanHigher } from './aqa-german';

// Placeholder common sections for modern languages
const COMMON_SECTIONS = [
  {
    id: 'sec-1-read-aloud',
    type: 'read_aloud',
    title: 'Reading Aloud',
    activeSeconds: 150,
    showInPrep: true,
    config: { requiresFollowUpQuestions: true, followUpCount: 2 }
  },
  {
    id: 'sec-2-roleplay',
    type: 'roleplay',
    title: 'Roleplay',
    activeSeconds: 150,
    showInPrep: true,
    config: {}
  },
  {
    id: 'sec-3-photo-card',
    type: 'photo_card',
    title: 'Picture Based Task',
    activeSeconds: 210,
    showInPrep: true,
    config: { requiresFollowUpQuestions: true, followUpCount: 2 }
  },
  {
    id: 'sec-4-conversation',
    type: 'conversation',
    title: 'Conversation',
    activeSeconds: 360,
    showInPrep: false,
    config: { themesToCover: 2, firstThemeSource: 'linked_to_selected_theme', secondThemeSource: 'random_different_theme' }
  }
] as any[];

export const EdexcelFrenchHigher: ExamBoardSchema = {
  id: 'edexcel-french-higher',
  board: 'Edexcel',
  level: 'GCSE',
  language: 'French',
  tier: 'Higher',
  globalPrepSeconds: 720,
  sections: COMMON_SECTIONS
};

export const EdexcelArabicHigher: ExamBoardSchema = {
  id: 'edexcel-arabic-higher',
  board: 'Edexcel',
  level: 'GCSE',
  language: 'Arabic',
  tier: 'Higher',
  globalPrepSeconds: 720,
  sections: COMMON_SECTIONS
};

export const ModernHebrewHigher: ExamBoardSchema = {
  id: 'modern-hebrew-higher',
  board: 'AQA', // Modern Hebrew is often AQA
  level: 'GCSE',
  language: 'Modern Hebrew',
  tier: 'Higher',
  globalPrepSeconds: 720,
  sections: COMMON_SECTIONS
};

export const SCHEMA_REGISTRY: Record<string, ExamBoardSchema> = {
  'Spanish': EdexcelSpanishHigher,
  'French': EdexcelFrenchHigher,
  'German': AqaGermanHigher,
  'Arabic': EdexcelArabicHigher,
  'Modern Hebrew': ModernHebrewHigher,
};

export function getSchemaForLanguage(language: string): ExamBoardSchema | null {
  // Exclude Biblical Hebrew as per user request
  if (language === 'Biblical Hebrew') return null;
  return SCHEMA_REGISTRY[language] || EdexcelSpanishHigher; // Default to Spanish if not found but not BH
}
