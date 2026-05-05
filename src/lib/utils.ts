import { Word } from '../types';

export function hashDevString(str: string): string {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h.toString(16);
}

export function getForeignWord(word: Word | undefined | null, language: string): string {
  if (!word) return '';
  
  switch (language) {
    case 'spanish':
      return word.spanish || word.hebrew || '';
    case 'french':
      return word.french || word.hebrew || '';
    case 'german':
      return word.german || word.hebrew || '';
    case 'biblical':
    case 'modern':
    default:
      return word.hebrew || '';
  }
}
