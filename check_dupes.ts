
import { VOCAB_REGISTRY } from './src/data/vocabRegistry.ts';

function check(name, list) {
    if (!list) {
        console.log(`${name} is empty or not found.`);
        return;
    }
    const ids = list.map(w => w.id);
    const seen = new Set();
    const dupes = [];
    for (const id of ids) {
        if (seen.has(id)) dupes.push(id);
        seen.add(id);
    }
    if (dupes.length > 0) {
        console.log(`DUPLICATES in ${name}:`, dupes);
    } else {
        console.log(`${name} is clean.`);
    }
}

for (const [lang, list] of Object.entries(VOCAB_REGISTRY)) {
    check(lang, list);
}
