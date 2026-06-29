
import { GCSEQuestion } from './question';

export type ListeningSectionType = 'A' | 'B' | 'C' | 'D';

export interface ListeningQuestion extends GCSEQuestion {
  audioClipId: string;
  transcript: string; // Mandatory for simulation engine
  section: ListeningSectionType;
}

export interface ListeningPaper {
  id: string;
  language: string;
  title: string;
  tier: 'foundation' | 'higher';
  theme: string;
  sections: {
    A: ListeningQuestion[];
    B?: ListeningQuestion[];
    C?: ListeningQuestion[];
    D?: ListeningQuestion[];
  };
  totalMarks: number;
}
