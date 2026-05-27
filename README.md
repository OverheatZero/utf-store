# App API

API em NestJS com autenticação JWT e persistência em PostgreSQL via Prisma.

## Tecnologias principais

- Node.js
- NestJS
- Prisma ORM
- PostgreSQL
- Docker e Docker Compose
- Nginx (proxy reverso no ambiente containerizado)

## Versão do Node

Este projeto possui duas referências de versão:

- Desenvolvimento local: `.nvmrc` define `v22.*`
- Containers (`Dockerfile`): imagem `node:20-alpine`

Recomendação para quem vai rodar localmente:

1. Usar a versão indicada no `.nvmrc` (`v22.*`) para manter consistência com o repositório.
2. Se for rodar apenas com Docker Compose, não é necessário instalar Node localmente.

Com `nvm`:

```bash
nvm install
nvm use
node -v
```

## Pré-requisitos

- Node.js (preferencialmente `v22.*` via `.nvmrc`)
- npm (já vem com Node)
- Docker e Docker Compose (opcional, mas recomendado para o banco)

## Estrutura resumida do projeto

```text
src/
  app.module.ts
  main.ts
  modules/
    auth/
    users/
  shared/
    config/
    database/
    decorators/
prisma/
  schema.prisma
  migrations/
generated/
  prisma/
```

### Visão de arquitetura

- `src/main.ts`: bootstrap do NestJS, com `ValidationPipe` global.
- `src/app.module.ts`: módulo raiz, importa módulos de domínio e aplica `AuthGuard` global.
- `src/modules/auth`: autenticação (`signup`, `signin`) e geração/validação de JWT.
- `src/modules/users`: endpoints de usuário autenticado.
- `src/shared/database`: `PrismaService` (conexão com Postgres) e `UsersRepository`.
- `src/shared/decorators`:
  - `@IsPublic()`: marca rotas públicas.
  - `@ActiveUserId()`: extrai `userId` do request autenticado.
- `prisma/schema.prisma`: modelo de dados e configuração do client Prisma.
- `generated/prisma`: client Prisma gerado (saída customizada do projeto).

## Configuração inicial (primeira execução)

## 1) Clonar e entrar na pasta

```bash
git clone <url-do-repo>
cd app-api
```

## 2) Configurar variáveis de ambiente

Crie o `.env` baseado no arquivo de exemplo:

```bash
cp .env.example .env
```

Variáveis mais importantes:

- `DATABASE_URL`: conexão principal usada pelo Prisma e aplicação.
- `SHADOW_DATABASE_URL`: usada no `prisma migrate dev`.
- `JWT_SECRET`: segredo para assinatura e validação de tokens.
- `DATABASE_*`: usadas principalmente no Docker Compose.

## 3) Subir PostgreSQL

Opção A (recomendada): via Docker Compose

```bash
docker compose up -d postgres
```

No `docker-compose.yml`, o PostgreSQL expõe a porta local `5432` para `5432` do container.

Se usar essa opção, ajuste o `.env` para refletir isso em `DATABASE_URL` e `SHADOW_DATABASE_URL`, por exemplo:

```env
DATABASE_URL="postgresql://someuser:someuniquepassword@localhost:5432/db-utf-store?schema=public"
SHADOW_DATABASE_URL="postgresql://someuser:someuniquepassword@localhost:5432/template1?schema=public"
```

Opção B: usar PostgreSQL local (fora do Docker), mantendo host/porta conforme sua instalação.

## 4) Instalar dependências

```bash
npm install
```

## 5) Gerar client Prisma

```bash
npx prisma generate
```

## 6) Aplicar migrations

```bash
npx prisma migrate dev
```

Esse comando:

- valida histórico de migrations
- cria/aplica novas migrations (se houver mudanças no schema)
- atualiza o banco de desenvolvimento

## 7) Subir a API

```bash
npm run start:dev
```

Por padrão, a aplicação sobe na porta `3000`.

## Prisma: guia passo a passo

Os comandos abaixo são os mais usados no dia a dia.

## Verificar status das migrations

```bash
npx prisma migrate status
```

Use quando quiser checar se o banco está sincronizado com `prisma/migrations`.

## Subir o banco de acordo com as migrations
```bash
npx prisma db push
```

## Gerar client após alterar `schema.prisma`

```bash
npx prisma generate
```

Neste projeto, o client é gerado em `generated/prisma`.

## Criar e aplicar migration de desenvolvimento

Sempre que alterar o schema:

```bash
npx prisma migrate dev --name nome_da_mudanca
```

Exemplo:

```bash
npx prisma migrate dev --name add_user_profile_fields
```

## Aplicar migrations já existentes (sem criar novas)

Para ambientes que só devem aplicar migrations versionadas:

```bash
npx prisma migrate deploy
```

## Resetar banco de desenvolvimento

```bash
npx prisma migrate reset
```

Atenção: esse comando apaga dados do banco de desenvolvimento.

## Abrir Prisma Studio

```bash
npx prisma studio
```

Interface visual para inspecionar e editar dados.

## Fluxo recomendado de alterações no banco

1. Altere `prisma/schema.prisma`.
2. Rode `npx prisma migrate dev --name <descricao>`.
3. Rode `npx prisma generate` (se necessário).
4. Teste a aplicação.
5. Commit das alterações de migration + código.

## Execução com Docker (stack completa)

Para subir app + postgres + nginx:

```bash
docker compose up --build -d
```

Serviços:

- `postgres`: banco de dados
- `app`: API NestJS
- `nginx`: proxy reverso na porta `80`

## Scripts úteis

- `npm run start:dev`: inicia com watch
- `npm run build`: build de produção
- `npm run start:prod`: executa build em `dist`
- `npm run lint`: lint com ESLint
- `npm run test`: testes unitários

## Endpoints principais

Autenticação (públicos):

- `POST /auth/signup`
- `POST /auth/signin`

Usuário (protegido por Bearer Token):

- `GET /users/me`

## Problemas comuns

## Erro de conexão com banco

- Verifique se o Postgres está rodando.
- Confirme host/porta do `DATABASE_URL`.
- Se estiver com Docker Compose, lembre que a porta publicada local é `51213`.

## Erro em `migrate dev` sobre shadow database

- Garanta que `SHADOW_DATABASE_URL` está definida e acessível.
- Em ambiente local, pode usar a mesma instância com outro database (ex.: `template1` no `.env.example`).

## `Unauthorized` em rotas protegidas

- Envie header `Authorization: Bearer <token>`.
- Confirme se o `JWT_SECRET` é o mesmo usado para assinar e validar token.

## Observações para manutenção

- O guard global exige autenticação por padrão; use `@IsPublic()` apenas quando necessário.
- O e-mail de login/cadastro é validado para domínio `utfpr.edu.br`.
- O client Prisma não vai para `node_modules`; ele é gerado em `generated/prisma` por configuração do projeto.