import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateMeDto {
  @IsString({ message: "O nome precisa ser uma string" })
  @IsOptional()
  name?: string;

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

  @IsString({ message: "O curso precisa ser uma string" })
  @IsOptional()
  course?: string;

  @IsString({ message: "O campus precisa ser uma string" })
  @IsOptional()
  campus?: string;

  @IsString({ message: "A URL do avatar precisa ser uma string" })
  @IsOptional()
  avatarUrl?: string;

  @IsString({ message: "A bio precisa ser uma string" })
  @MinLength(25, { message: "A bio precisa ter no minimo 25 caracteres" })
  @IsOptional()
  bio?: string;
}
