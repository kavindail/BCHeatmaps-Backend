import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  isValidEmail(email: string) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  async signup(email: string, password: string) {
    try {
      if (!this.isValidEmail(email)) {
        return HttpStatus.BAD_REQUEST;
      }
      const status = await this.usersService.createUser(email, password);
      return status;
    } catch (error) {
      console.log('User signup error: ' + error);
      return HttpStatus.BAD_REQUEST;
    }
  }

  async signIn(email: string, password: string) {
    let payload = {
      email: email,
      expiryTime: Math.floor(Date.now() / 5000) + 60 * 60,
    };
    const verified = await this.usersService.verifyUserCredentials(
      email,
      password,
    );
    // console.log('Verified: ' + verified);
    if (verified) {
      const jwtToken = await this.generateJWTToken(payload);
      await this.storeJWTToken(email, jwtToken);
      // console.log('JWT Token returned is: ' + jwtToken);
      // const verifiedPayload = await this.verifyJWTToken(jwtToken);
      // console.log('Verified JWT Token: ' + verifiedPayload);
      return HttpStatus.OK;
    } else {
      return HttpStatus.UNAUTHORIZED;
    }
  }

  async getAllUsers() {
    return this.usersService.getAllUsers();
  }
  async verifyJWTToken(signedPayload) {
    const jwtSecret = process.env.JWT_SECRET || '{}';
    try {
      let decodedPayload = await this.jwtService.verify(signedPayload, {
        secret: jwtSecret,
      });
      console.log('decoded payload');
      console.log(decodedPayload);
    } catch (error) {
      console.log('Error verifying jwt token: ' + error);
      return HttpStatus.UNAUTHORIZED;
    }
  }

  async generateJWTToken(payload) {
    let signedPayload = await this.jwtService.signAsync(payload);
    console.log('Payload signed:  ' + signedPayload);
    return signedPayload;
  }

  async sendJWTToken() {
    //TODO: Send the jwt token in the form of an http only cookie
  }

  async storeJWTToken(email, jwtToken) {
    await this.usersService.storeJWTToken(email, jwtToken);
  }
}
