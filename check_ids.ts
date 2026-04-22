import * as fs from 'fs';

const files = fs.readdirSync('./src/data').filter(f => f.endsWith('.ts'));
const ids = new Set();
const duplicates = new Set();

for (const file of files) {
  const content = fs.readFileSync(`./src/data/${file}`, 'utf-8');
  const matches = content.match(/id:\s*['"]([^'"]+)['"]/g) || [];
  for (const match of matches) {
    const id = match.split(/['"]/)[1];
    if (ids.has(id)) {
      duplicates.add(id);
    }
    ids.add(id);
  }
}

console.log('Duplicates:', Array.from(duplicates));
