# UTF Store — Monorepo

Monorepo com npm workspaces reunindo o frontend (Vue 3 + Vite), o backend
(NestJS + Prisma) e um pacote de código compartilhado entre os dois.

## Estrutura

```
utf-store/
├── frontend/   app-front  — Vue 3, Vite, Pinia, PrimeVue
├── backend/    app-api    — NestJS, Prisma, Socket.IO
└── shared/     @utf-store/shared — tipos, constantes e validações comuns
```

O histórico dos dois projetos originais foi preservado via `git subtree`.

## Requisitos

- Node.js 22+
- npm 10+ (workspaces)

## Instalação

```bash
npm install          # instala as dependências de todos os workspaces
npm run build:shared # gera o build do pacote compartilhado
```

## Scripts (raiz)

| Script | Descrição |
| --- | --- |
| `npm run dev` | sobe frontend e backend em paralelo |
| `npm run dev:front` | apenas o frontend (Vite) |
| `npm run dev:api` | apenas o backend (Nest, modo watch) |
| `npm run build` | build de shared, backend e frontend |
| `npm run build:shared` | build apenas do pacote compartilhado |
| `npm run lint` | lint em todos os workspaces |
| `npm run test` | testes do backend |
| `npm run typecheck` | checagem de tipos do frontend |

## Pacote compartilhado

`shared/` é publicado internamente como `@utf-store/shared` e resolvido pelos
workspaces do npm — não é preciso publicar nada em registry.

```ts
import { UserRole, LISTING_TYPES, isUtfprStudentEmail } from '@utf-store/shared'
```

O pacote gera build dual (CommonJS para o NestJS, ESM para o Vite) a partir de
`shared/src`. Depois de alterar o shared, rode `npm run build:shared` (ou
`npm run dev:shared` para modo watch).
