import {existsSync,readFileSync} from 'node:fs';
const required=['.docflow/CONVENTIONS.md','.docflow/INDEX.md','.docflow/adr/0001-example.md','OPERATIONS.md'];
const missing=required.filter(p=>!existsSync(p));
if(missing.length){console.error('verify: missing '+missing.join(', '));process.exit(1);}
if(!readFileSync('OPERATIONS.md','utf8').includes('operator sign-off'))process.exit(1);
console.log('verify: OK (legacy coordination fixture)');
