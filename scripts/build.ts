/**
 * Builds dist/esm and dist/cjs, then marks dist/cjs as CommonJS.
 * Usage: node scripts/build.ts
 */
import { execFileSync } from 'node:child_process';
import { rmSync, writeFileSync } from 'node:fs';

rmSync('dist', { recursive: true, force: true });
const tsc = (project: string) => execFileSync('npx', ['tsc', '-p', project], { stdio: 'inherit' });
tsc('tsconfig.build.json');
tsc('tsconfig.cjs.json');
writeFileSync('dist/cjs/package.json', JSON.stringify({ type: 'commonjs' }) + '\n');
