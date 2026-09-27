import { Test } from "@nestjs/testing";
import type { TestingModule } from "@nestjs/testing";
import { HealthController } from "./health.controller";

describe("HealthController", () => {
  let controller: HealthController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = moduleRef.get(HealthController);
  });

  it('responde { status: "ok" }', () => {
    expect(controller.check()).toEqual({ status: "ok" });
  });

  // O monitoring.yml faz curl --fail em /api/health e trata qualquer coisa
  // diferente de 2xx como incidente. O contrato do corpo é o que o workflow
  // usa para diferenciar "no ar" de "respondendo lixo".
  it("mantém o contrato usado pelo health check do CI", () => {
    expect(Object.keys(controller.check())).toEqual(["status"]);
  });
});
