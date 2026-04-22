const fs = require('fs');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) { 
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
const keys = new Map();

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const matches = content.match(/key=\{.*?\}/g);
  if (matches) {
    matches.forEach(m => {
      keys.set(m, (keys.get(m) || 0) + 1);
    });
  }
});

Array.from(keys.entries())
  .sort((a,b) => b[1] - a[1])
  .forEach(([key, count]) => console.log(`${count}: ${key}`));
