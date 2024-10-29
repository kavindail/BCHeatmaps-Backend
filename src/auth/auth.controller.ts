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

    //TODO: Rewrite this function so that signUp returns either tue or false
    //Make the controller return the status codes and not the service

    //This should return either true or false
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
    //TODO: Rewrite this function so that signIn returns the http token
    //Make the controller return the status codes and not the service
    //Make the service return a null
    let status = await this.authService.signIn(
      userDetails.email,
      userDetails.password,
    );

    if (status === HttpStatus.UNAUTHORIZED) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Username or password incorrect.' });
    } else if (HttpStatus.OK) {
      //TODO: Return the actual http only token here
      //TODO: Move this into its own function not in the controller
      res.cookie('token', 'test-token-val', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, //1 day
      });
      return res
        .status(HttpStatus.OK)
        .json({ message: 'User signed in succesfully.' });
    } else {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Bad request please try again.' });
    }
  }
}
