import {
  defineRailway,
  github,
  postgres,
  preserve,
  project,
  service,
  volume,
} from "railway/iac";

const REPO = "UTF-STORE/utf-store";
const BRANCH = "main";

// Os dois serviços buildam a partir da raiz do repo (os workspaces do npm
// hoistam as dependências), então sem watch patterns todo push redeploya os
// dois. Estes são os caminhos que realmente afetam cada imagem.
const SHARED_PATHS = ["/shared/**", "/package.json", "/package-lock.json"];

export default defineRailway(() => {
  const db = postgres("postgres");

  // region e sizeMB espelham o volume que já existe no projeto. Omitir a
  // region faz o plan tentar anulá-la, o que conta como mudança destrutiva.
  const uploads = volume("uploads", {
    sizeMB: 1024,
    region: "us-east4-eqdc4a",
  });

  // NestJS + Prisma atrás de um Caddy interno. Sem domínio público: só é
  // alcançado pelo frontend através da rede privada do Railway.
  const backend = service("backend", {
    source: github(REPO, { branch: BRANCH }),
    build: {
      builder: "DOCKERFILE",
      dockerfilePath: "Dockerfile.backend",
      watchPatterns: ["/backend/**", "/Dockerfile.backend", ...SHARED_PATHS],
    },
    deploy: {
      restartPolicyType: "ON_FAILURE",
      restartPolicyMaxRetries: 10,
      // Espelha os limites já configurados no painel; sem declarar, o IaC os
      // remove e o serviço passa a usar o teto do plano.
      limitOverride: {
        containers: { cpu: 1, memoryBytes: 2000000000 },
      },
    },
    preDeploy: "npx prisma migrate deploy",
    env: {
      DATABASE_URL: db.env.DATABASE_URL,

      // PORT fixo: é a porta que o frontend/Caddyfile procura no DNS privado.
      PORT: "3000",

      // O domínio público da API continua ativo, então clientes externos batem
      // direto no backend. Sem esta variável, getCorsOrigin() devolve true e
      // libera qualquer origem. As chamadas do SPA passam pelo proxy do Caddy e
      // são same-origin, então não dependem disto.
      CORS_ORIGIN: "https://utf-store.up.railway.app",

      OPENROUTER_MODEL: "cohere/north-mini-code:free",

      // Segredos ficam fora do git. Defina cada um no painel antes do primeiro
      // apply; preserve() manda o Railway manter o valor já existente.
      JWT_SECRET: preserve(),
      OPENROUTER_API_KEY: preserve(),
    },
    volumeMounts: {
      "/app/uploads": uploads,
    },
  });

  // Caddy serve o dist do Vue e faz proxy reverso de /api, /uploads, /docs e
  // /socket.io para o backend. O default do frontend/Caddyfile aponta para
  // "backend.railway.internal:3000" — daí o nome do serviço acima importar.
  const frontend = service("frontend", {
    source: github(REPO, { branch: BRANCH }),
    build: {
      builder: "DOCKERFILE",
      dockerfilePath: "Dockerfile.frontend",
      watchPatterns: ["/frontend/**", "/Dockerfile.frontend", ...SHARED_PATHS],
    },
    env: {
      // O domínio privado NÃO acompanha rename de serviço: o backend se chama
      // "backend" mas responde em app-api.railway.internal. Esta referência é
      // resolvida pelo Railway, então continua certa se o domínio mudar.
      BACKEND_URL: "http://${{backend.RAILWAY_PRIVATE_DOMAIN}}:3000",
    },
    deploy: {
      restartPolicyType: "ON_FAILURE",
      restartPolicyMaxRetries: 10,
      // Espelha os limites já configurados no painel; sem declarar, o IaC os
      // remove e o serviço passa a usar o teto do plano.
      limitOverride: {
        containers: { cpu: 1, memoryBytes: 2000000000 },
      },
    },
  });

  return project("utf-store", {
    resources: [db, backend, frontend],
  });
});
