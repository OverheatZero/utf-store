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
| `npm run typecheck` | checagem de tipos de shared, backend e frontend |
| `npm run lint:check` | lint sem `--fix` (usado pelo hook de pre-commit) |
| `npm run check` | `lint:check` + `typecheck` |

## Git hooks

Os hooks são gerenciados pelo [husky](https://typicode.github.io/husky/) e
instalados automaticamente pelo `npm install` (script `prepare`).

| Hook | O que faz |
| --- | --- |
| `commit-msg` | valida a mensagem no padrão [Conventional Commits](https://www.conventionalcommits.org/) via commitlint |
| `pre-commit` | roda `npm run check` (lint + checagem de tipos do monorepo) |
| `post-checkout` | ao trocar de branch: `npm install` se `package.json`/lock mudou, `prisma generate` se o schema mudou, `build:shared` se o pacote compartilhado mudou |
| `post-merge` | o mesmo, comparando `ORIG_HEAD..HEAD` após um merge/pull |

Para pular os hooks em uma emergência:

```bash
git commit --no-verify -m "..."
```

## Pacote compartilhado

`shared/` é publicado internamente como `@utf-store/shared` e resolvido pelos
workspaces do npm — não é preciso publicar nada em registry.

```ts
import { UserRole, LISTING_TYPES, isUtfprStudentEmail } from '@utf-store/shared'
```

O pacote gera build dual (CommonJS para o NestJS, ESM para o Vite) a partir de
`shared/src`. Depois de alterar o shared, rode `npm run build:shared` (ou
`npm run dev:shared` para modo watch).



## CI / CD (GitHub Actions)

`.github/workflows/` tem uma responsabilidade por arquivo:

| Workflow | Quando roda | O que faz |
| --- | --- | --- |
| `ci.yml` | PR e push em `main` | `qualidade` (lint + Prettier), `testes` (Jest do backend, com cobertura), `typecheck`, `build` do monorepo e `imagens` (build dos dois Dockerfiles) |
| `deploy.yml` | push em `main` | **não publica**: aguarda o rollout do Railway, faz smoke test em `/api/health`, `/` e `/docs` e registra a versão em *Deployments → production* |
| `monitoring.yml` | a cada 15 min (cron) e sob demanda | `curl --fail` no endpoint publicado (API e frontend) |
| `railway-config.yml` | PR que toca `.railway/**` | IaC do Railway: `plan` no PR, `apply` no merge |

O deploy em si é automático: os dois serviços têm `source: github(..., { branch: "main" })`
no `.railway/railway.ts`, então o Railway constrói e publica a cada push em
`main` sem passar pelo Actions. O `deploy.yml` existe para deixar esse caminho
explícito no repositório e para falhar visivelmente se a versão não subir.

### Testes

```bash
npm run test                       # Jest do backend
npm run test -w app-api -- --watch
```

Os testes vivem em `backend/src/**/*.spec.ts` (é o `testRegex` do Jest em
`backend/package.json`). Hoje cobrem o `HealthController` — o mesmo endpoint que
o `monitoring.yml` consulta — e o `getCorsOrigin()` de `backend/src/shared/config/env.ts`.

O Jest usa `moduleDirectories: ["node_modules", "<rootDir>/.."]` pelo mesmo
motivo do `NODE_PATH=/app/dist` em produção: o código importa
`src/shared/...` apoiado no `baseUrl` do `tsconfig.json`, e sem isso o Jest não
resolve esses caminhos.

### Observações sobre o `schedule`

O cron do `monitoring.yml` só dispara na branch default (`main`) e é suspenso
pelo GitHub após 60 dias sem atividade no repositório. Em qualquer branch dá
para rodar na mão pelo botão **Run workflow** (`workflow_dispatch`).

## Deploy (Railway)

Dois serviços a partir deste mesmo repo, mais o Postgres. Um único caminho de
entrada para o SPA: o Caddy do frontend serve o `dist` e faz proxy reverso para
o backend pela rede privada, então as chamadas do app são same-origin.

```
navegador ──► [frontend] Caddy :$PORT ──┬─ /api/*     → (tira /api) ──┐
                                        ├─ /uploads/*, /docs, /socket.io/* ──┤
                                        └─ /*         → dist/ + fallback SPA │
                                                                             ▼
                                                    [backend] Caddy :$PORT → Nest 127.0.0.1:3001 → Postgres
```

| Arquivo | Papel |
| --- | --- |
| `.railway/railway.ts` | Infrastructure as Code: serviços, build, variáveis, volume, watch patterns |
| `.github/workflows/railway-config.yml` | roda `plan` no PR e `apply` no merge |
| `Dockerfile.frontend` / `Dockerfile.backend` | imagens dos dois serviços |
| `frontend/Caddyfile` | estáticos + fallback SPA + proxy para o backend |
| `backend/Caddyfile` | proxy para o Nest, forçando `X-Forwarded-Proto: https` |
| `backend/docker-entrypoint.sh` | sobe Caddy em background e o Nest em foreground |

### Infrastructure as Code

A configuração dos serviços vive em `.railway/railway.ts` — build, Dockerfile,
watch patterns, variáveis, volume e pre-deploy. O Railway **não** aplica esse
arquivo em push: quem aplica é a CLI, ou o workflow `railway-config.yml` quando
um PR que toca `.railway/**` é mergeado.

```bash
railway login
railway link            # escolhe projeto + environment
railway config plan     # mostra o diff, não altera nada
railway config apply    # aplica após confirmação
```

**Requer Railway CLI 5.42.1 ou mais nova** — o motor de IaC passou a viver na
CLI. Versões antigas falham com *"Could not find Railway configuration support
for this project"*, que é uma mensagem enganosa: o problema é a CLI, não o SDK.

```bash
railway --version       # precisa ser >= 5.42.1
```

O pacote `railway` está nas devDependencies da raiz: é dele que sai o
`railway/iac` importado pelo arquivo de autoria.

O `railway.json` / `railway.toml` (Config as Code) foi descontinuado pelo
Railway e só funciona para serviços legados até **2026-12-01**. Este projeto usa
IaC.

### Leia antes do primeiro apply

O IaC casa recursos **por nome**. Se os nomes no `railway.ts` não baterem com os
do projeto, o `plan` mostra criação dos novos e **remoção dos antigos** — o que
inclui apagar a database e o volume dela. Rode `railway config plan` e confira
que a linha diz `0 to destroy` antes de aplicar.

Os nomes esperados são `backend`, `frontend` e `postgres`.

### O que ainda é feito no painel

O IaC não gerencia estes itens:

- **Domínios gerados** (`*.up.railway.app`) — ficam fora do `railway.ts` por
  decisão do Railway. Hoje: `utf-store.up.railway.app` no frontend e
  `utf-store-api.up.railway.app` no backend.
- **Segredos** — `JWT_SECRET` e `OPENROUTER_API_KEY` estão como `preserve()`,
  ou seja, o Railway mantém o valor já existente. Defina os dois no painel
  **antes** do primeiro `apply`.
- **`RAILWAY_TOKEN`** — token de projeto com escopo no environment de produção,
  salvo nos secrets do repositório para o workflow.

### Detalhes que não são óbvios

- O serviço precisa se chamar `backend`: o `frontend/Caddyfile` tem
  `http://backend.railway.internal:3000` como default. Para outro nome, defina
  `BACKEND_URL` no serviço `frontend`.
- `PORT=3000` no backend é fixo de propósito — é a porta que o Caddy do
  frontend procura no DNS privado.
- A API tem domínio público, então `CORS_ORIGIN` é definido explicitamente no
  `railway.ts`. Sem ele, `getCorsOrigin()` devolve `true` e libera qualquer
  origem. O SPA não depende disso: passa pelo proxy e é same-origin.
- `NODE_PATH=/app/dist` no runtime do backend: `backend/tsconfig.json` usa
  `baseUrl`, então o JS emitido mantém imports como `src/shared/config/env` e
  `generated/prisma/client`. Sem isso o boot morre com `MODULE_NOT_FOUND`.
- `VITE_API_URL` entra como build arg do `Dockerfile.frontend` (padrão `/api`),
  não como `.env.production` — o `.gitignore` ignora `.env.*`.
- O backend usa `trust proxy`, e o `backend/Caddyfile` força
  `X-Forwarded-Proto: https`, para que as URLs de upload saiam com `https://`.
