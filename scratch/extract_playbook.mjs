import { PLAYBOOK } from '../frontend/js/engine/playbook3d.js';
import { writeFileSync, mkdirSync } from 'fs';

mkdirSync(new URL('../shared/', import.meta.url), { recursive: true });
const outPath = new URL('../shared/playbook.json', import.meta.url);
writeFileSync(outPath, JSON.stringify(PLAYBOOK, null, 2));
console.log('Wrote', Object.keys(PLAYBOOK).length, 'plays to', outPath.pathname);
