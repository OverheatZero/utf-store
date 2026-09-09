# App Front

Aplicação frontend em Vue 3 com TypeScript, gerenciamento de estado com Pinia e UI components PrimeVue.

## Tecnologias principais

- Vue 3
- TypeScript
- Vite (build tool)
- Pinia (state management)
- PrimeVue (UI components)
- Tailwind CSS (styling)
- Axios (HTTP client)
- Vue Router (roteamento)
- Zod (schema validation)

## Versão do Node

Este projeto possui duas referências de versão:

- Desenvolvimento local: `.nvmrc` define `v22.*`
- Package.json: suporta `^20.19.0 || >=22.12.0`

Recomendação para quem vai rodar localmente:

1. Usar a versão indicada no `.nvmrc` (`v22.*`) para manter consistência com o repositório.
2. Se usar `nvm`, rode os comandos abaixo.

Com `nvm`:

```bash
nvm install
nvm use
node -v
```

## Pré-requisitos

- Node.js (preferencialmente `v22.*` via `.nvmrc`)
- npm (já vem com Node)

## Estrutura resumida do projeto

```text
src/
  main.ts                    # Bootstrap da aplicação Vue
  App.vue
  assets/
    styles/
      main.css
      preset.ts             # Tema PrimeVue customizado
  components/
    common/                  # Componentes reutilizáveis
    private/                 # Componentes de área autenticada
  domain/
    auth/                    # Lógica de autenticação
    user/                    # Lógica de usuário
    listing/                 # Lógica de anúncios/listagens
    base/
      BaseHttpClientService.ts
  helpers/
    formatters/              # Formatação de dados
    regex/                   # Expressões regulares
    validations/             # Funções de validação
  router/
    index.ts
    public/                  # Rotas públicas (signin, signup)
    private/                 # Rotas autenticadas
  stores/
    auth/                    # Pinia store de autenticação
    user/                    # Pinia store de usuário
    listing/                 # Pinia store de listagens
  views/
    PublicView/              # Layout de rotas públicas
    PrivateView/             # Layout de rotas privadas
```

### Visão de arquitetura

**Padrão de domínio:**
- `domain/<feature>/Model.ts`: tipos/interfaces
- `domain/<feature>/Repository.ts`: chamadas HTTP
- `domain/<feature>/Service.ts`: lógica de negócio
- `stores/<feature>/index.ts`: state management com Pinia

**Componentes:**
- `components/common/`: botões, inputs, cards genéricos
- `components/private/`: componentes específicos da área autenticada

**Roteamento:**
- `/public/auth/*`: rotas de signin/signup
- `/app/*`: rotas privadas (requer autenticação)
- `/`: redireciona para signin ou app conforme authenticated

**Styling:**
- Tailwind CSS + PrimeVue components
- Tema customizado em `assets/styles/preset.ts`

## Configuração inicial (primeira execução)

### 1) Clonar e entrar na pasta

```bash
git clone <url-do-repo>
cd app-front
```

### 2) Instalar dependências

```bash
npm install
```

### 3) Configurar variáveis de ambiente

Crie o `.env.local` baseado no arquivo de exemplo:

```bash
cp .env.example .env.local
```

Variável importante:

- `VITE_API_URL`: URL da API (desenvolvimento: `http://localhost:3000`)

Para deploy no Vercel, a variável `VERCEL_OIDC_TOKEN` é usada no CI/CD e deve ser configurada nas variáveis secretas do projeto Vercel.

### 4) Subir a aplicação

```bash
npm run dev
```

Por padrão, a aplicação sobe em `http://localhost:5173`.

## Fluxo de desenvolvimento

### Desenvolvimento com hot-reload

```bash
npm run dev
```

Abre a aplicação em `http://localhost:5173` com reload automático ao salvar arquivos.

### Build para produção

```bash
npm run build
```

Cria uma versão otimizada em `dist/`.

### Preview da build de produção

```bash
npm run preview
```

Simula a aplicação em produção localmente (útil para testar antes de fazer deploy).

### Linting com ESLint

```bash
npm run lint
```

Verifica erros de lint e style com ESLint + Prettier.

### Formatar código com Prettier

```bash
npm run format
```

Formata código automaticamente.

## Type-checking com TypeScript

O projeto usa `vue-tsc` para type-checking:

```bash
npm run build
```

A flag `-b` na build ativa type-checking incremental.

## Fluxo de autenticação

1. Usuário submete email e senha na view de signin/signup.
2. `AuthService` chama `AuthRepository` para fazer POST na API.
3. API retorna `token` (JWT) e dados do usuário.
4. `authStore` (Pinia) armazena token e dados.
5. Token é enviado em header `Authorization: Bearer <token>` em todas as requisições autenticadas.
6. Router valida se usuário está autenticado antes de acessar rotas privadas.
7. Logout limpa o store e redireciona para signin.

## Estrutura de stores (Pinia)

Cada domínio tem seu próprio store:

**authStore:**
- `token`: JWT armazenado
- `user`: dados do usuário autenticado
- `signup()`, `signin()`, `logout()`

**userStore:**
- Dados do usuário autenticado
- Métodos para atualizar perfil

**listingStore:**
- Lista de anúncios/listagens
- Métodos para criar, atualizar, deletar anúncios

## Integração com API

A comunicação com a API é feita via `Axios`:

1. **BaseHttpClientService**: classe base que configura interceptadores
   - Adiciona token JWT automaticamente em headers
   - Trata erros globais

2. **Repository**: classes específicas por domínio
   - `AuthRepository.ts`: POST /auth/signin, /auth/signup
   - `UserRepository.ts`: GET /users/me, etc.
   - `ListingRepository.ts`: CRUD de anúncios

3. **Service**: orquestração de lógica
   - Chama Repository
   - Valida dados com Zod
   - Atualiza stores

## Componentes PrimeVue

Principais componentes utilizados:

- **Button**: botões
- **InputText**: inputs de texto
- **Password**: inputs de senha (com toggle)
- **Card**: cards genéricos
- **Form**: formulários com validação
- **Toast**: notificações
- **ConfirmDialog**: diálogos de confirmação
- **DataTable**: tabelas (listagens)

Customização via `preset.ts` e variáveis CSS (theme variables).

## Validação de dados

O projeto usa **Zod** para validação:

```typescript
const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres')
})
```

Helpers de validação em `src/helpers/validations/`:
- Email validation
- Password validation
- Etc.

## Deploy no Vercel

### Configuração automática

O arquivo `.vercelproject.json` contém a configuração do projeto Vercel.

### Variáveis de ambiente

No painel do Vercel, configure:

```env
VITE_API_URL=https://api.production.url
VERCEL_OIDC_TOKEN=<seu-token>
```

### Build e deploy

```bash
npm run build
```

Vercel detecta automaticamente a pasta `dist/` como output.

### Preview e produção

- **Preview**: `https://<branch>.project.vercel.app` (cada branch tem um preview)
- **Produção**: `https://project.vercel.app` (main branch)

## Problemas comuns

### Erro de conexão com a API

- Verifique se a API está rodando em `http://localhost:3000` (ou o valor do `VITE_API_URL`).
- Confira se há CORS habilitado na API.
- Verifique network tab do DevTools para ver a requisição exata.

### Token expirado ou inválido

- Limpe localStorage (DevTools → Application → Local Storage).
- Faça logout e login novamente.
- Verifique se `JWT_SECRET` na API é o mesmo usado para assinar o token.

### Hot-reload não funciona

- Certifique-se que `npm run dev` está rodando.
- Verifique se há erros de compilação (check console do terminal).
- Limpe cache do browser (Ctrl+Shift+Delete).

### Build falha com erro de type-checking

```bash
npm run build
```

Se falhar com erro de TS, verifique:
- Se há imports não resolvidos
- Se há tipos faltando (`any` deve virar tipo explícito)
- Use `vue-tsc --noEmit` para debug de tipos

## Scripts úteis

- `npm run dev`: inicia dev server com hot-reload
- `npm run build`: type-check + build otimizado
- `npm run preview`: simula build em produção
- `npm run lint`: lint com ESLint
- `npm run format`: formata código com Prettier
- `npm run format:check`: verifica se código está formatado

## Observações para manutenção

- Componentes PrimeVue são lazy-loaded quando possível (melhor performance).
- Tailwind CSS + PrimeVue classes podem ser combinadas.
- Pinia stores são reativas automaticamente (property access atualiza UI).
- Type-check é rigoroso (`noUncheckedIndexedAccess: true`), por isso erros podem aparecer na build mas não no dev.
