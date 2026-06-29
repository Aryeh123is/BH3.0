import { ExamBoardSchema } from '../../types/speaking-engine';

export const AqaGermanHigher: ExamBoardSchema = {
  id: 'aqa-german-higher',
  board: 'AQA',
  level: 'GCSE',
  language: 'German',
  tier: 'Higher',
  globalPrepSeconds: 720, // 12 minutes prep shared with roleplay & photocard
  sections: [
    {
      id: 'sec-1-roleplay',
      type: 'roleplay',
      title: 'Role-play',
      activeSeconds: 120, // ~2 mins for roleplay
      showInPrep: true,
      config: {
        bulletPointsCount: 5,
        unpredictableCount: 1,
        studentQuestionCount: 1
      }
    },
    {
      id: 'sec-2-photocard',
      type: 'photo_card',
      title: 'Photo Card',
      activeSeconds: 180, // ~3 mins
      showInPrep: true,
      config: {
        visiblePromptCount: 3,
        unseenPromptCount: 2
      }
    },
    {
      id: 'sec-3-conversation-theme-1',
      type: 'conversation',
      title: 'General Conversation (Part 1 - Nominated Theme)',
      activeSeconds: 180, // ~2.5 - 3 mins
      showInPrep: false,
      config: {
        themeSource: 'student_nominated'
      }
    },
    {
      id: 'sec-4-conversation-theme-2',
      type: 'conversation',
      title: 'General Conversation (Part 2)',
      activeSeconds: 180, // ~2.5 - 3 mins
      showInPrep: false,
      config: {
        themeSource: 'examiner_selected_different_from_part_1'
      }
    }
  ]
};
