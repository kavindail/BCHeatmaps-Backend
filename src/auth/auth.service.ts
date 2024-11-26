import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

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
        return false;
      }
      const status = await this.usersService.createUser(email, password);
      if (status) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log('User signup error: ' + error);
      return false;
    }
  }

  async signIn(email: string, password: string) {
    const verified = await this.usersService.verifyUserCredentials(
      email,
      password,
    );

    const userID = await this.usersService.getUserIdFromEmail(email);

    const payload = {
      email: email,
      userID: userID,
    };

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
      const decodedJwtToken = await this.jwtService.verify(jwtToken, {
        secret: jwtSecret,
      });
      const email = decodedJwtToken.email;
      const userID = decodedJwtToken.userID;
      const expiryTime = decodedJwtToken.exp;

      await this.usersService.checkJWTAgainstDB(jwtToken, email);

      const expiredToken = await this.checkTokenExpired(expiryTime);
      if (expiredToken) {
        return false;
      }
      return true;
    } catch (error) {
      console.log('Error verifying jwt token: ' + error);
      return false;
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
    const signedJWTToken = await this.jwtService.signAsync(payload);
    return signedJWTToken;
  }

  async storeJWTToken(email, jwtToken) {
    await this.usersService.storeJWTToken(email, jwtToken);
  }
}
