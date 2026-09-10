import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export class SignupDto {
  @ApiProperty({
    description: "Nome completo do usuário",
    example: "example",
  })
  @IsString({ message: "O nome precisa ser uma string" })
  @IsNotEmpty({ message: "O nome não pode estar vázio" })
  name: string;

  @ApiProperty({
    description:
      "Endereço de e-mail institucional de aluno da UTFPR (deve terminar com @alunos.utfpr.edu.br)",
    example: "example@alunos.utfpr.edu.br",
  })
  @IsString({ message: "O email precisa ser uma string" })
  @IsNotEmpty({ message: "O email não pode estar vázio" })
  @IsEmail(
    {
      host_whitelist: [/^alunos\.utfpr\.edu\.br$/i],
    },
    {
      message:
        "O email precisa ser institucional de aluno da UTFPR (alunos.utfpr.edu.br)",
    },
  )
  email: string;

  @ApiProperty({
    description: "Senha do usuário (mínimo de 6 caracteres)",
    example: "senha123",
    minLength: 6,
  })
  @IsString({ message: "A senha precisa ser uma string" })
  @IsNotEmpty({ message: "A senha não pode estar vázio" })
  @MinLength(6, { message: "A senha precisa ter no mínimo 6 caracteres" })
  password: string;

  @ApiProperty({
    description: "Curso do usuário",
    example: "Engenharia de Software",
  })
  @IsString({ message: "O curso precisa ser uma string" })
  @IsNotEmpty({ message: "O curso não pode estar vázio" })
  course: string;

  @ApiProperty({
    description: "Campus do usuário",
    example: "Dois Vizinhos",
  })
  @IsString({ message: "O campus precisa ser uma string" })
  @IsNotEmpty({ message: "O campus não pode estar vázio" })
  campus: string;

  @ApiPropertyOptional({
    description: "URL da imagem de perfil (avatar)",
    example: "http://localhost:3000/uploads/profiles/1719598144000.png",
  })
  @IsString({ message: "A URL do avatar precisa ser uma string" })
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty({
    description: "Biografia do usuário (mínimo de 25 caracteres)",
    example:
      "Estudante de Engenharia de Software interessado em tecnologias web.",
    minLength: 25,
  })
  @IsString({ message: "A bio precisa ser uma string" })
  @IsNotEmpty({
    message: "A bio não pode estar vázia. Fale um pouco sobre você.",
  })
  @MinLength(25, { message: "A bio precisa ter no mínimo 25 caracteres" })
  bio: string;

  @ApiPropertyOptional({
    description: "Indica se a conta do usuário é verificada (padrão false)",
    example: false,
  })
  @IsBoolean({ message: "A verificação precisa ser um booleano" })
  @IsOptional()
  isVerified?: boolean;
}
