import {
  Get,
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import * as cookie from 'cookie';

type UserDetails = {
  email: string;
  password: string;
};
type jwtToken = {
  jwtToken: string;
};

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() userDetails: UserDetails, @Res() res: Response) {
    console.log('POST made to /auth/signup');

    //TODO: Instead of modifying signup just send it to login to return
    let status = await this.authService.signup(
      userDetails.email,
      userDetails.password,
    );

    //Also want to log in the user when they sign up so they can get a jwt token
    let jwtToken = await this.authService.signIn(
      userDetails.email,
      userDetails.password,
    );

    if (status) {
      res.cookie('token', jwtToken, {
        httpOnly: true,
        secure: false, //TODO: Set to true in https prod environment
        sameSite: 'none', //TODO: Set to strict or lax in prod environment
        maxAge: 100 * 60 * 60 * 1000, //100 hours
      });
      console.log('User created: ', status);
      return res
        .status(HttpStatus.CREATED)
        .json({ message: 'User signed up succesfully.' });
    } else {
      console.log('User failed to create: ', status);
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Invalid email or signup failed.' });
    }
  }

  @Get()
  async getAllUsers() {
    console.log('GET made to /auth');
    const users = await this.authService.getAllUsers();
    return JSON.stringify(users);
  }

  @Post('verifyToken')
  async verifyToken(@Req() req: Request, @Res() res: Response) {
    console.log('POST made to /auth/verifyToken');
    const cookies = cookie.parse(req.headers.cookie || '');
    const jwtToken = cookies['token'];
    console.log('JWT Token provided is: ', jwtToken);
    if (!jwtToken) {
      return res.status(401).json({ message: 'No jwt token provided' });
    }

    let verified = await this.authService.verifyJWTToken(jwtToken);
    if (verified) {
      return res
        .status(HttpStatus.OK)
        .json({ message: 'JWT Token has been verified.' });
    } else {
      //TODO: This should trigger a delete of the token on the frontend,
      //the jwt token is invalid, another login attempt should be made
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'JWT Token invalid' });
    }
  }

  @Post('login')
  async signIn(@Body() userDetails: UserDetails, @Res() res: Response) {
    console.log('POST made to /auth/login');
    let jwtToken = await this.authService.signIn(
      userDetails.email,
      userDetails.password,
    );

    if (!jwtToken) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Username or password incorrect.' });
    } else {
      res.cookie('token', jwtToken, {
        httpOnly: true,
        secure: false, //TODO: Set to true in https prod environment
        sameSite: 'none', //TODO: Set to strict or lax in prod environment
        maxAge: 100 * 60 * 60 * 1000, //100 hours
      });
      return res
        .status(HttpStatus.OK)
        .json({ message: 'User signed in succesfully.' });
    }
  }
}
