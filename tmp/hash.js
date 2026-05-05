const crypto = require('crypto');
console.log('leonisadmin hash:', crypto.createHash('sha256').update('leonisadmin').digest('hex'));
console.log('email hash:', crypto.createHash('sha256').update('aisaacsaul@gmail.com').digest('hex'));
