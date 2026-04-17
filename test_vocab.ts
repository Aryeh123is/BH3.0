import { SPANISH_EDEXCEL_VOCABULARY } from './src/data/spanish_edexcel.ts';

const keywords = ['family', 'friend', 'brother', 'sister', 'mother', 'father', 'son', 'daughter', 'uncle', 'aunt', 'grand', 'cousin', 'marry', 'boyfriend', 'girlfriend', 'people', 'person', 'neighbor', 'neighbour', 'invite', 'call', 'love', 'name', 'relationship', 'wedding'];
const filtered = SPANISH_EDEXCEL_VOCABULARY.filter(word => {
  const eng = word.english.toLowerCase();
  return keywords.some(k => eng.includes(k.toLowerCase()));
});
console.log("Filtered Length:", filtered.length);
