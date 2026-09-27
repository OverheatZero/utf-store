describe("getCorsOrigin", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      DATABASE_URL: "postgresql://user:pass@localhost:5432/test?schema=public",
      JWT_SECRET: "test-secret",
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  // env.ts roda `import "dotenv/config"`, que NÃO sobrescreve variáveis já
  // presentes. Por isso usamos string vazia em vez de `delete`: apagar a chave
  // deixaria um .env local vazar para dentro do teste.
  const loadEnv = (corsOrigin: string) => {
    process.env.CORS_ORIGIN = corsOrigin;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require("./env") as typeof import("./env");
  };

  it("libera qualquer origem quando CORS_ORIGIN está vazia", () => {
    expect(loadEnv("").getCorsOrigin()).toBe(true);
  });

  it("devolve uma string quando há uma única origem", () => {
    expect(loadEnv("https://utf-store.up.railway.app").getCorsOrigin()).toBe(
      "https://utf-store.up.railway.app",
    );
  });

  it("devolve um array quando há várias origens", () => {
    expect(
      loadEnv("http://localhost:5173,http://localhost:8081").getCorsOrigin(),
    ).toEqual(["http://localhost:5173", "http://localhost:8081"]);
  });

  it("ignora espaços e entradas vazias da lista", () => {
    expect(
      loadEnv(
        " http://localhost:5173 , , http://localhost:8081 ",
      ).getCorsOrigin(),
    ).toEqual(["http://localhost:5173", "http://localhost:8081"]);
  });

  it("falha na subida quando JWT_SECRET não está definida", () => {
    process.env.JWT_SECRET = "";
    expect(() => loadEnv("")).toThrow();
  });
});
