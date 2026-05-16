import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class SigninDto {
  @IsString({ message: "O email precisa ser uma string" })
  @IsNotEmpty({ message: "O email não pode estar vázio" })
  @IsEmail(
    {
      host_whitelist: [/(?:[A-Za-z0-9-]+\.)*utfpr\.edu\.br$/i],
    },
    { message: "O email precisa ser institucional da UTFPR (utfpr.edu.br)" },
  )
  email: string;

  @IsString({ message: "A senha precisa ser uma string" })
  @IsNotEmpty({ message: "A senha não pode estar vázia" })
  @MinLength(6, { message: "A senha precisa ter no mínimo 6 caracteres" })
  password: string;
}
