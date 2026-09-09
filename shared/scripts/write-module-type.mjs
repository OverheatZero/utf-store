// O pacote é CommonJS por padrão (consumido pelo NestJS). O build ESM precisa de
// um package.json próprio marcando `type: module`, senão o Node/Vite trata os
// arquivos de dist/esm como CommonJS.
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const targets = [
  ['dist/cjs', 'commonjs'],
  ['dist/esm', 'module'],
]

for (const [dir, type] of targets) {
  const outDir = join(root, dir)
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'package.json'), `${JSON.stringify({ type }, null, 2)}\n`)
}
