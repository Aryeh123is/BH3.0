import fs from 'fs';
import path from 'path';

const spContent = fs.readFileSync('src/data/spanish_edexcel.ts', 'utf8');

const matches = spContent.match(/english:\s*'([^']+)'/g);
let words = [];
if (matches) {
  words = matches.map(m => m.match(/english:\s*'([^']+)'/)[1]);
}

const familyKeywords = ['family', 'friend', 'brother', 'sister', 'mother', 'father', 'son', 'daughter', 'uncle', 'aunt', 'grand', 'cousin', 'marry', 'boyfriend', 'girlfriend', 'people', 'person', 'neighbor', 'neighbour', 'invite', 'call', 'love', 'name', 'relationship', 'wedding'];

const filtered = words.filter(eng => {
  return familyKeywords.some(k => eng.toLowerCase().includes(k.toLowerCase()));
});

console.log(`Matched ${filtered.length} out of ${words.length} for Family & Friends`);
