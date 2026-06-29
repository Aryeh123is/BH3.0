import { Word } from '../types';

export function hashDevString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash;
  }
  return new Uint32Array([hash])[0].toString(36);
}

export function generateId(prefix: string = 'id'): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `${prefix}-${timestamp}-${random}`;
}

export function getDuplicateKeyWarning(items: any[], keyGetter: (item: any) => string): string[] {
  const keys = new Set<string>();
  const duplicates: string[] = [];
  
  items.forEach(item => {
    const key = keyGetter(item);
    if (keys.has(key)) {
      duplicates.push(key);
    }
    keys.add(key);
  });
  
  return duplicates;
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
    case 'arabic':
      return word.arabic || word.hebrew || '';
    case 'biblical':
    case 'modern':
    default:
      return word.hebrew || '';
  }
}

export function getStandardLanguageName(langKey: string): string {
  if (!langKey) return 'Spanish';
  const mapping: Record<string, string> = {
    'spanish': 'Spanish',
    'french': 'French',
    'german': 'German',
    'arabic': 'Arabic',
    'modern': 'Modern Hebrew',
    'biblical': 'Biblical Hebrew'
  };
  return mapping[langKey.toLowerCase().trim()] || langKey;
}

