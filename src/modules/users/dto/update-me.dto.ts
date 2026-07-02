import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class UpdateMeDto {
  @ApiPropertyOptional({
    description: "Nome completo do usuário",
    example: "example",
  })
  @IsString({ message: "O nome precisa ser uma string" })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: "Endereço de e-mail institucional de aluno da UTFPR",
    example: "example@alunos.utfpr.edu.br",
  })
  @IsString({ message: "O email precisa ser uma string" })
  @IsEmail(
    {
      host_whitelist: [/^alunos\.utfpr\.edu\.br$/i],
    },
    {
      message:
        "O email precisa ser institucional de aluno da UTFPR (alunos.utfpr.edu.br)",
    },
  )
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: "Curso do usuário",
    example: "Engenharia de Software",
  })
  @IsString({ message: "O curso precisa ser uma string" })
  @IsOptional()
  course?: string;

  @ApiPropertyOptional({
    description: "Campus da UTFPR",
    example: "Dois Vizinhos",
  })
  @IsString({ message: "O campus precisa ser uma string" })
  @IsOptional()
  campus?: string;

  @ApiPropertyOptional({
    description: "URL da imagem de perfil (avatar)",
    example: "http://localhost:3000/uploads/profiles/1719598144000.png",
  })
  @IsString({ message: "A URL do avatar precisa ser uma string" })
  @IsOptional()
  avatarUrl?: string;

  @ApiPropertyOptional({
    description: "Biografia do usuário (mínimo de 25 caracteres)",
    example: "Estudante de Engenharia de Software.",
    minLength: 25,
  })
  @IsString({ message: "A bio precisa ser uma string" })
  @MinLength(25, { message: "A bio precisa ter no minimo 25 caracteres" })
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({
    description: "Prompt padrão do usuário para buscas/recomendações (máximo de 500 caracteres)",
    example: "usuario gostaria de ver livros de calculo",
    maxLength: 500,
  })
  @IsString({ message: "O prompt padrao precisa ser uma string" })
  @MaxLength(500, {
    message: "O prompt padrao pode ter no maximo 500 caracteres",
  })
  @IsOptional()
  defaultUserPrompt?: string;
}
