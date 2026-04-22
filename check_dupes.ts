
import { VOCABULARY as bh } from './src/data/vocabulary.ts';
import { MODERN_HEBREW_VOCABULARY as mh } from './src/data/modern_hebrew.ts';
import { SPANISH_EDEXCEL_VOCABULARY as es } from './src/data/spanish_edexcel.ts';
import { FRENCH_EDEXCEL_VOCABULARY as fr } from './src/data/french_edexcel.ts';

function check(name, list) {
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

check('Biblical Hebrew', bh);
check('Modern Hebrew', mh);
check('Spanish', es);
check('French', fr);
