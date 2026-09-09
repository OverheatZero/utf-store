import { Controller, Get } from "@nestjs/common";
import { IsPublic } from "src/shared/decorators/IsPublic";

@Controller("health")
export class HealthController {
  @Get()
  @IsPublic()
  check() {
    return { status: "ok" };
  }
}
