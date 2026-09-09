import { Body, Controller, Headers, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags, ApiHeader } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { SigninDto } from "./dto/signin.dto";
import { SignupDto } from "./dto/signup.dto";
import { AuthResponseDto } from "./dto/auth-response.dto";
import { IsPublic } from "src/shared/decorators/IsPublic";

@ApiTags("Auth")
@Controller("auth")
@IsPublic()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signin")
  @ApiOperation({ summary: "Realizar o login de um usuário cadastrado" })
  @ApiHeader({
    name: "ambient",
    required: false,
    description:
      'Ambiente de login: "admin" (web) ou "client" (mobile). Opcional.',
    example: "admin",
  })
  @ApiResponse({
    status: 200,
    description:
      "Autenticação realizada com sucesso. Retorna o token de acesso JWT.",
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Dados fornecidos inválidos.",
  })
  @ApiResponse({
    status: 401,
    description:
      "Credenciais inválidas (e-mail ou senha incorretos) ou ambiente não autorizado para este usuário.",
  })
  signin(@Body() signinDto: SigninDto, @Headers("ambient") ambient?: string) {
    return this.authService.signin(signinDto, ambient);
  }

  @Post("signup")
  @ApiOperation({ summary: "Criar uma nova conta de usuário" })
  @ApiResponse({
    status: 201,
    description:
      "Usuário cadastrado com sucesso. Retorna o token de acesso JWT.",
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      "Dados fornecidos inválidos (e-mail incorreto, biografia muito curta, etc).",
  })
  @ApiResponse({
    status: 409,
    description: "Conflito. O endereço de e-mail já está sendo utilizado.",
  })
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }
}
