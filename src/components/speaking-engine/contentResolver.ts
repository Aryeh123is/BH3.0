import { ExamSectionSchema, ResolvedTaskSnapshot, TaskType, SPEAKING_FLOW, SpeakingPaper } from '../../types/speaking-engine';
import { getVocabForLanguage } from '../../data/vocabRegistry';
import { ItemHistoryService } from '../../services/speaking/itemHistory';
import { ExamEnvironment } from '../../types';
import { SPEAKING_PAPERS } from '../../data/speakingPapers';

import { EXAM_RULES } from '../../core/examRules';

// We now import from the subjects directory directly
const SUPPORTED_LANGUAGES = EXAM_RULES.SUPPORTED_LANGUAGES;

function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export async function generateExamSnapshot(
  sections: ExamSectionSchema[],
  selectedThemeId: string,
  language: string,
  environment: ExamEnvironment = 'TRAINING'
): Promise<ResolvedTaskSnapshot[]> {
  const snapshots: ResolvedTaskSnapshot[] = [];
  
  // Use a dynamic import or a registry to load the correct JSON bank
  let bank: any[] = [];
  const langMap: Record<string, string> = {
    'Modern Hebrew': 'hebrew',
    'Spanish': 'spanish',
    'French': 'french',
    'German': 'german',
    'Arabic': 'arabic'
  };
  const path = langMap[language] || language.toLowerCase().replace(' ', '_');
  try {
    const module = await import(`../../data/subjects/${path}/speaking.json`);
    bank = module.default;
  } catch (e) {
    console.error(`Failed to load speaking bank for ${language}`, e);
    throw new Error(`DATASET_MISSING_${language}`);
  }

  const isExam = environment === 'EXAM';
  
  // If it's a formal exam, we attempt to resolve a full paper instead of picking items individually
  let selectedPaper: SpeakingPaper | null = null;
  if (isExam) {
    const langPapers = SPEAKING_PAPERS[path] || [];
    if (langPapers.length > 0) {
      selectedPaper = langPapers[Math.floor(Math.random() * langPapers.length)];
    }
  }

  // Group bank by type for lookups or random assembly
  const safeBank = Array.isArray(bank) ? bank : [];
  const allConversations = safeBank.filter(c => c.type === 'conversation' || c.type === 'conversation_question');

  for (const section of sections) {
    let content: any = null;
    let options: any[] | undefined = undefined;

    if (section.type === 'read_aloud') {
      let raw;
      if (selectedPaper) {
        raw = safeBank.find(c => c.id === selectedPaper.items.readAloudId);
      } else {
        const matches = shuffle(safeBank.filter(c => c.type === 'read_aloud'));
        const filtered = ItemHistoryService.filterRecentlyUsed(matches, `${language}_read_aloud`);
        raw = filtered.find(c => c.themeId === selectedThemeId) || filtered[0] || matches[0];
      }

      if (raw) {
        ItemHistoryService.markAsUsed(raw.id, `${language}_read_aloud`);
        content = {
          ...raw,
          followUpQuestions: (raw.followUpQuestionIds || []).map((id: string) => 
            allConversations.find(c => c.id === id) || { id, questionText: "Question content missing" }
          )
        };
      }
    } 
    else if (section.type === 'roleplay') {
      if (selectedPaper) {
        content = safeBank.find(c => c.id === selectedPaper.items.roleplayId);
      } else {
        const matches = shuffle(safeBank.filter(c => c.type === 'roleplay'));
        const filtered = ItemHistoryService.filterRecentlyUsed(matches, `${language}_roleplay`);
        content = filtered.find(c => c.themeId === selectedThemeId) || filtered[0] || matches[0];
      }
      
      if (content) {
        ItemHistoryService.markAsUsed(content.id, `${language}_roleplay`);
      }
    }
    else if (section.type === 'photo_card') {
      let pcMatches: any[] = [];
      if (selectedPaper) {
        pcMatches = (selectedPaper?.items?.photoCardOptionIds || []).map(id => safeBank.find(c => c.id === id)).filter(Boolean);
      } else {
        const matches = shuffle(safeBank.filter(c => c.type === 'photo_card'));
        const filtered = ItemHistoryService.filterRecentlyUsed(matches, `${language}_photo_card`);
        pcMatches = filtered.filter(c => c.themeId === selectedThemeId);
        if (pcMatches.length === 0) pcMatches = [filtered[0] || matches[0]];
      }
      
      if (pcMatches.length > 0) {
        options = pcMatches.slice(0, 2).map(pc => {
          const imageUrls = pc.imageUrls || (pc.imageUrl ? [pc.imageUrl] : []);
          const primary = imageUrls[0] || pc.imageUrl;
          const secondary = imageUrls[1] || imageUrls[0];

          return {
            ...pc,
            imageUrl: primary,
            secondaryImageUrl: secondary,
            followUpQuestions: (pc.followUpQuestionIds || []).map((id: string) => 
              allConversations.find(c => c.id === id) || { id, questionText: "Question content missing" }
            )
          };
        });
        
        content = options[0];
        options.forEach(opt => ItemHistoryService.markAsUsed(opt.id, `${language}_photo_card`));
      }
    }
    else if (section.type === 'conversation') {
      let linkedThemes = selectedPaper ? selectedPaper.items.conversationThemes : [selectedThemeId];
      let linkedQuestions = allConversations.filter(c => linkedThemes.includes(c.themeId));
      
      if (linkedQuestions.length === 0) linkedQuestions = allConversations.slice(0, 3);

      const otherThemes = [...new Set(allConversations.map(c => c.themeId))].filter(t => !linkedThemes.includes(t));
      const randomTheme = otherThemes.length > 0 ? otherThemes[Math.floor(Math.random() * otherThemes.length)] : linkedThemes[0];
      const randomQuestions = allConversations.filter(c => c.themeId === randomTheme && !linkedThemes.includes(c.themeId));
      
      content = { 
        linked: shuffle(linkedQuestions).slice(0, 5), 
        random: shuffle(randomQuestions.length > 0 ? randomQuestions : allConversations).slice(0, 5) 
      };
    }

    if (content || options) {
      let linkedSteps: string[] = [];
      if (section.type === 'read_aloud') linkedSteps = ["READ_ALOUD", "READ_ALOUD_FOLLOWUPS"];
      else if (section.type === 'roleplay') linkedSteps = ["ROLEPLAY"];
      else if (section.type === 'photo_card') linkedSteps = ["PHOTO_CARD_CHOICE", "PHOTO_CARD_FOLLOWUPS"];
      else if (section.type === 'conversation') linkedSteps = ["FREE_CONVERSATION"];

      snapshots.push({
        sectionId: section.id,
        type: section.type,
        linkedSteps,
        title: section.title,
        showInPrep: section.showInPrep,
        activeSeconds: section.activeSeconds,
        content,
        options,
      });
    }
  }

  return snapshots;
}


