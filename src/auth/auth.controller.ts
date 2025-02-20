import { Controller, Post, Body, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto'; 
import { LoginUserDto } from 'src/users/dtos/login-user.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('register/user')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.authService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }
  @Post('validate-token')
  async validateToken(@Body('token') token: string) {
    if (!token) {
      throw new UnauthorizedException('Token is required');
    }

    try {
      // Validate and decode the token
      const validatedToken = await this.authService.validateToken(token);

      // Format and return the validated token response
      return {
        access_token: token,
        user: {
          email: validatedToken.email,
          role: validatedToken.role,
          profile: validatedToken.profile || null, // Ensure profile is included, if available
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
