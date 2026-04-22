const fs = require('fs');

const files = [
  'src/data/vocabulary.ts',
  'src/data/modern_hebrew.ts',
  'src/data/spanish_edexcel.ts',
  'src/data/french_edexcel.ts'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const ids = [];
    const idRegex = /id:\s*['"]([^'"]+)['"]/g;
    let match;
    while ((match = idRegex.exec(content)) !== null) {
      ids.push(match[1]);
    }
    
    const seen = new Set();
    const dupes = [];
    ids.forEach(id => {
      if (seen.has(id)) {
        dupes.push(id);
      }
      seen.add(id);
    });
    
    if (dupes.length > 0) {
      console.log(`File: ${file} has duplicate IDs: ${dupes.join(', ')}`);
    } else {
      console.log(`File: ${file} is clean.`);
    }
  }
});
