import { Word } from '../types';

export function getForeignWord(word: Word | undefined | null, language: string): string {
  if (!word) return '';
  
  switch (language) {
    case 'spanish':
      return word.spanish || word.hebrew || '';
    case 'french':
      return word.french || word.hebrew || '';
    case 'biblical':
    case 'modern':
    default:
      return word.hebrew || '';
  }
}
