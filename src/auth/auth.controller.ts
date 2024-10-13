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
  email: string;
  password: string;
};

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body() userDetails: UserDetails) {
    console.log('POST Call made to /auth/signup');
    return this.authService.signup(userDetails.email, userDetails.password);
  }

  @Get()
  async getAllUsers() {
    console.log('Get Call made to /auth');
    const users = await this.authService.getAllUsers();
    return JSON.stringify(users);
  }

  @Post('login')
  signIn(@Body() userDetails: UserDetails) {
    console.log('Get Call made to /auth');
    return this.authService.signIn(userDetails.email, userDetails.password);
  }
}
