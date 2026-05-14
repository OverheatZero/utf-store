import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export class SignupDto {
  @IsString({ message: "O nome precisa ser uma string" })
  @IsNotEmpty({ message: "O nome não pode estar vázio" })
  name: string;

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
  @IsNotEmpty({ message: "A senha não pode estar vázio" })
  @MinLength(6, { message: "A senha precisa ter no mínimo 6 caracteres" })
  password: string;

  @IsString({ message: "O curso precisa ser uma string" })
  @IsNotEmpty({ message: "O curso não pode estar vázio" })
  course: string;

  @IsString({ message: "O campus precisa ser uma string" })
  @IsNotEmpty({ message: "O campus não pode estar vázio" })
  campus: string;

  @IsString({ message: "A URL do avatar precisa ser uma string" })
  @IsOptional()
  avatarUrl: string;

  @IsString({ message: "A bio precisa ser uma string" })
  @IsNotEmpty({
    message: "A bio não pode estar vázia. Fale um pouco sobre você.",
  })
  @MinLength(25, { message: "A bio precisa ter no mínimo 25 caracteres" })
  bio: string;

  @IsBoolean({ message: "A verificação precisa ser um booleano" })
  @IsOptional()
  isVerified?: boolean;
}
