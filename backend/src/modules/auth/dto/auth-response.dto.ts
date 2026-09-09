import { ApiProperty } from "@nestjs/swagger";

export class AuthResponseDto {
  @ApiProperty({
    description: "Token de acesso JWT para autenticação nas rotas protegidas",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  accessToken: string;
}
