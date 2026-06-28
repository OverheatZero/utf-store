import { ApiProperty } from "@nestjs/swagger";

export class UserResponseDto {
  @ApiProperty({
    description: "ID único do usuário (UUID)",
    example: "123abc654def",
  })
  id: string;

  @ApiProperty({
    description: "Nome completo do usuário",
    example: "example",
  })
  name: string;

  @ApiProperty({
    description: "E-mail institucional da UTFPR do usuário",
    example: "example@alunos.utfpr.edu.br",
  })
  email: string;

  @ApiProperty({
    description: "Curso do usuário",
    example: "Engenharia de Software",
  })
  course: string;

  @ApiProperty({
    description: "Campus do usuário",
    example: "Dois Vizinhos",
  })
  campus: string;

  @ApiProperty({
    description: "URL da imagem de perfil (avatar)",
    example: "http://localhost:3000/uploads/profiles/1719598144000.png",
    nullable: true,
  })
  avatarUrl: string | null;

  @ApiProperty({
    description: "Biografia do usuário",
    example: "Estudante de Engenharia de Software",
  })
  bio: string;

  @ApiProperty({
    description: "Prompt padrão do usuário para buscas/recomendações",
    example: "usuario gostaria de ver livros de calculo",
  })
  defaultUserPrompt: string;

  @ApiProperty({
    description: "Indica se a conta do usuário foi verificada",
    example: false,
  })
  isVerified: boolean;

  @ApiProperty({
    description: "Função/cargo do usuário no sistema",
    example: "client",
    enum: ["admin", "client"],
  })
  role: string;

  @ApiProperty({
    description: "Data de criação do usuário",
    example: "2026-06-28T18:49:08.000Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Data da última atualização do usuário",
    example: "2026-06-28T18:49:08.000Z",
  })
  updatedAt: Date;
}

export class MeResponseDto {
  @ApiProperty({
    description: "Dados do usuário autenticado",
    type: UserResponseDto,
  })
  me: UserResponseDto;
}
