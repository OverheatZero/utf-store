import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { compare, hash } from "bcryptjs";
import { SigninDto } from "./dto/signin.dto";
import { UsersRepository } from "src/shared/database/repositories/users.repositories";
import { JwtService } from "@nestjs/jwt";
import { SignupDto } from "./dto/signup.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signin(signinDto: SigninDto) {
    const { email, password } = signinDto;
    const user = await this.usersRepo.findUnique({
      where: {
        email,
      },
    });

    if (!user) throw new UnauthorizedException("Invalid Credentials");

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException("Invalid Credentials");

    const accessToken = await this.generateAccessToken(user.id);
    return { accessToken };
  }

  async signup(signupDto: SignupDto) {
    const { name, email, password } = signupDto;

    const emailTaken = await this.usersRepo.findUnique({
      where: { email },
      select: { id: true },
    });

    if (emailTaken) {
      throw new ConflictException("This email is a already in use");
    }

    const hashedPassword = await hash(password, 12);

    const user = await this.usersRepo.create({
      data: {
        name,
        email,
        password: hashedPassword,
        avatarUrl: signupDto.avatarUrl || null,
        bio: signupDto.bio,
        campus: signupDto.campus,
        course: signupDto.course,
        role: "client",
      },
    });

    const accessToken = await this.generateAccessToken(user.id);

    return {
      accessToken,
    };
  }

  private generateAccessToken(userId: string) {
    return this.jwtService.signAsync({ sub: userId });
  }
}
