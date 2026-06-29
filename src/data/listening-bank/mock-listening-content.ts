import { GCSEQuestion } from '../../types/question';

export const MOCK_LISTENING_QUESTIONS: Record<string, GCSEQuestion[]> = {
  'Spanish': [
    {
      id: 'l-sp-1',
      examBoard: 'Edexcel',
      tier: 'Higher',
      topic: 'Identity and culture',
      subtopic: 'Friends and Family',
      difficulty: 3,
      type: 'listening',
      question: 'What does the speaker say about their relationship with their brother?',
      answer: 'They used to argue but now they get on well',
      acceptableAnswers: ['They are close now', 'They argue less'],
      explanation: 'The speaker uses the imperfect tense "nos peleábamos" followed by the present "nos llevamos fenomenal".',
      marks: 2,
      tags: ['family', 'relationships']
    }
  ]
};
