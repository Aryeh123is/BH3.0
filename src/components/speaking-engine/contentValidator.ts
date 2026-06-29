
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  correctedContent?: any;
  replacedWords?: string[];
  invalidFields?: string[];
}

function extractWords(text: string): string[] {
  // Strip punctuation and split
  const cleaned = text.replace(/[\.,;\!\?¿¡\(\)\[\]"']/g, '').toLowerCase();
  return cleaned.split(/\s+/).filter(w => w.length > 0);
}

export async function validateExamContent(
  content: any,
  wordBank: any[]
): Promise<ValidationResult> {
  const errors: string[] = [];
  const invalidFields: string[] = [];
  let isAiRepairNeeded = false;
  let isImgMissing = false;
  
  // 1. Build local word bank dictionary
  const validWords = new Set<string>();
  wordBank.forEach(word => {
    // Check all keys except id, english, category
    Object.keys(word).forEach(key => {
      if (key !== 'id' && key !== 'english' && key !== 'category') {
        const terms = extractWords(String(word[key]));
        terms.forEach(t => validWords.add(t));
      }
    });
  });

  // Small whitelist of common grammatical words / names that might be missed
  const whitelist = new Set(['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'y', 'o', 'pero', 'en', 'a', 'de', 'con', 'para', 'por', 'mi', 'tu', 'su', 'qué', 'que', 'te', 'se', 'me', 'nos', 'le', 'les', 'es', 'son', 'hay']);
  whitelist.forEach(w => validWords.add(w));

  const checkText = (text: string, fieldName: string) => {
    const words = extractWords(text);
    const unknownWords = words.filter(w => !validWords.has(w));
    if (unknownWords.length > 0) {
      errors.push(`Vocabulary violation in ${fieldName}: [${unknownWords.join(', ')}]`);
      invalidFields.push(fieldName);
      isAiRepairNeeded = true;
    }
  };

  // 2. Validate Image & Structure
  const isPhotoCard = content.imageUrl !== undefined || (typeof content.id === 'string' && content.id.startsWith('pc-'));
  
  if (isPhotoCard) {
    if (!content.imageUrl || content.imageUrl.trim() === '') {
      errors.push("Missing valid imageUrl for photo card.");
      invalidFields.push("imageUrl");
      isImgMissing = true;
    }
    
    const examinerPrompts = content.examinerPrompts || [];
    if (examinerPrompts.length !== 3) {
      errors.push(`Photo card must have exactly 3 examinerPrompts, found ${examinerPrompts.length}.`);
      invalidFields.push("examinerPrompts");
      isAiRepairNeeded = true;
    }

    if (examinerPrompts.length > 0) {
      const q1 = String(examinerPrompts[0]).trim().toLowerCase();
      // Look for describe the photo in spanish/french/german/english
      if (!q1.includes("describe") && !q1.includes("décris") && !q1.includes("beschreibe") && !q1.includes("describa")) {
        errors.push(`Question 1 MUST be "Describe the photo." (or equivalent). Found: "${examinerPrompts[0]}"`);
        invalidFields.push("examinerPrompts");
        isAiRepairNeeded = true;
      }
    }
  }

  // 3. Validate Text Fields
  if (typeof content.passageText === 'string') {
    checkText(content.passageText, 'passageText');
  }
  if (Array.isArray(content.studentPrompts)) {
    content.studentPrompts.forEach((p: any, i: number) => {
      if (typeof p === 'string') checkText(p, `studentPrompts[${i}]`);
    });
  }
  if (Array.isArray(content.examinerPrompts)) {
    content.examinerPrompts.forEach((p: any, i: number) => {
      if (typeof p === 'string') checkText(p, `examinerPrompts[${i}]`);
    });
  }
  
  // Specific check for Conversation which is a nested object
  if (content.linked && Array.isArray(content.linked)) {
    content.linked.forEach((q: any, i: number) => {
      if (q.questionText) checkText(q.questionText, `linked[${i}].questionText`);
    });
  }
  if (content.random && Array.isArray(content.random)) {
    content.random.forEach((q: any, i: number) => {
      if (q.questionText) checkText(q.questionText, `random[${i}].questionText`);
    });
  }

  // 4. Return immediately with results
  return {
    isValid: !isAiRepairNeeded && !isImgMissing && errors.length === 0,
    errors,
    invalidFields
  };
}

