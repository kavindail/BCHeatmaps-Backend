import {
  Get,
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';

type UserDetails = {
  username: string;
  password: string;
};

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body() userDetails: UserDetails) {
    console.log('POST Call made to /auth/signup');
    return this.authService.signup(userDetails.username, userDetails.password);
  }

  @Get()
  async getAllUsers() {
    const users = await this.authService.getAllUsers();
    return JSON.stringify(users);
  }

  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }
}
