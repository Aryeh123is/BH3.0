
import { Word } from '../types';
import { SPANISH_EDEXCEL_VOCABULARY } from './spanish_edexcel';
import { FRENCH_EDEXCEL_VOCABULARY } from './french_edexcel';
import { GERMAN_AQA_VOCABULARY } from './german_aqa';
import { ARABIC_EDEXCEL_VOCABULARY } from './arabic_edexcel';
import { MODERN_HEBREW_VOCABULARY } from './modern_hebrew';

export const VOCAB_REGISTRY: Record<string, Word[]> = {
  'Spanish': SPANISH_EDEXCEL_VOCABULARY,
  'French': FRENCH_EDEXCEL_VOCABULARY,
  'German': GERMAN_AQA_VOCABULARY,
  'Arabic': ARABIC_EDEXCEL_VOCABULARY,
  'Modern Hebrew': MODERN_HEBREW_VOCABULARY,
};

export function getVocabForLanguage(language: string): Word[] {
  return VOCAB_REGISTRY[language] || [];
}
