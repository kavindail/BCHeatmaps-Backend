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
      // expiryTime: Math.floor(Date.now() / 5000) + 60 * 60,
    };
    const verified = await this.usersService.verifyUserCredentials(
      email,
      password,
    );
    if (verified) {
      const jwtToken = await this.generateJWTToken(payload);
      await this.storeJWTToken(email, jwtToken);
      return jwtToken;
    } else {
      return null;
    }
  }

  async getAllUsers() {
    return this.usersService.getAllUsers();
  }
  async verifyJWTToken(jwtToken) {
    const jwtSecret = process.env.JWT_SECRET || '{}';
    try {
      let decodedJwtToken = await this.jwtService.verify(jwtToken, {
        secret: jwtSecret,
      });

      const email = decodedJwtToken.email;
      const expiryTime = decodedJwtToken.exp;
      // console.log('Decoded JWT Token: ');
      // console.log(decodedJwtToken);

      let verifiedJWT = await this.usersService.checkJWTAgainstDB(
        jwtToken,
        email,
      );
      if (!verifiedJWT) {
        return false;
      }

      const expiredToken = await this.checkTokenExpired(expiryTime);
      if (expiredToken) {
        return false;
      }
      return true;
    } catch (error) {
      console.log('Error verifying jwt token: ' + error);
      return HttpStatus.UNAUTHORIZED;
    }
  }
  async checkTokenExpired(expiryTime) {
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime >= expiryTime) {
      return true;
    } else {
      return false;
    }
  }

  async generateJWTToken(payload) {
    let signedPayload = await this.jwtService.signAsync(payload);
    // console.log('Payload signed:  ' + signedPayload);
    return signedPayload;
  }

  async storeJWTToken(email, jwtToken) {
    await this.usersService.storeJWTToken(email, jwtToken);
  }
}
