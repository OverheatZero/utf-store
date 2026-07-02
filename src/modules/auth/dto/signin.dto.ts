import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class SigninDto {
  @ApiProperty({
    description: "E-mail institucional da UTFPR",
    example: "example@alunos.utfpr.edu.br",
  })
  @IsString({ message: "O email precisa ser uma string" })
  @IsNotEmpty({ message: "O email não pode estar vázio" })
  @IsEmail(
    {
      host_whitelist: [/(?:[A-Za-z0-9-]+\.)*utfpr\.edu\.br$/i],
    },
    { message: "O email precisa ser institucional da UTFPR (utfpr.edu.br)" },
  )
  email: string;

  @ApiProperty({
    description: "Senha da conta (mínimo de 6 caracteres)",
    example: "senha123",
    minLength: 6,
  })
  @IsString({ message: "A senha precisa ser uma string" })
  @IsNotEmpty({ message: "A senha não pode estar vázia" })
  @MinLength(6, { message: "A senha precisa ter no mínimo 6 caracteres" })
  password: string;
}
