import {
  Get,
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

type UserDetails = {
  email: string;
  password: string;
};

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() userDetails: UserDetails, @Res() res: Response) {
    console.log('POST made to /auth/signup');
    console.log(userDetails);
    let status = await this.authService.signup(
      userDetails.email,
      userDetails.password,
    );
    if (status === HttpStatus.BAD_REQUEST) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Invalid email or signup failed.' });
    } else {
      res
        .status(HttpStatus.CREATED)
        .json({ message: 'User created succesfully.' });
    }
  }

  @Get()
  async getAllUsers() {
    console.log('GET made to /auth');
    const users = await this.authService.getAllUsers();
    return JSON.stringify(users);
  }

  @Post('login')
  async signIn(@Body() userDetails: UserDetails, @Res() res: Response) {
    console.log('POST made to /auth/login');

    let status = await this.authService.signIn(
      userDetails.email,
      userDetails.password,
    );

    if (status === HttpStatus.UNAUTHORIZED) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Username or password incorrect.' });
    } else {
      res
        .status(HttpStatus.OK)
        .json({ message: 'User signed in succesfully.' });
    }
  }
}
