import { ExamBoardSchema } from '../../types/speaking-engine';

export const EdexcelSpanishHigher: ExamBoardSchema = {
  id: 'edexcel-spanish-higher-2024',
  board: 'Edexcel',
  level: 'GCSE',
  language: 'Spanish',
  tier: 'Higher',
  globalPrepSeconds: 720, // 12 minutes
  sections: [
    {
      id: 'sec-1-read-aloud',
      type: 'read_aloud',
      title: 'Reading Aloud',
      activeSeconds: 150, // Reading + Follow up
      showInPrep: true,
      config: {
        requiresFollowUpQuestions: true,
        followUpCount: 2
      }
    },
    {
      id: 'sec-2-roleplay',
      type: 'roleplay', 
      title: 'Roleplay',
      activeSeconds: 150, // ~2.5 minutes
      showInPrep: true,
      config: {}
    },
    {
      id: 'sec-3-photo-card',
      type: 'photo_card', 
      title: 'Picture Based Task',
      activeSeconds: 210, // ~3.5 minutes
      showInPrep: true,
      config: {
        requiresFollowUpQuestions: true,
        followUpCount: 2
      }
    },
    {
      id: 'sec-4-conversation',
      type: 'conversation',
      title: 'Conversation',
      activeSeconds: 360, // 5-6 mins Higher tier
      showInPrep: false, // Absolutely hidden during 12m prep limit
      config: {
        themesToCover: 2,
        firstThemeSource: 'linked_to_selected_theme',
        secondThemeSource: 'random_different_theme'
      }
    }
  ]
};
