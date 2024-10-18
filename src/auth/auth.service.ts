import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    // private jwtService: JwtService,
  ) {}

  async signup(email: string, password: string) {
    //TODO: Process the email here with regex to verify
    //it is a valid email before sending it on to the function
    try {
      const user = await this.usersService.createUser(email, password);
      return user;
    } catch (error) {
      console.log('Error on user signup in AuthService');
      return HttpStatus.BAD_REQUEST;
    }
  }

  async signIn(email: string, password: string) {
    const verified = await this.usersService.verifyUserCredentials(
      email,
      password,
    );
    // console.log('Verified: ' + verified);
    if (verified) {
      return HttpStatus.OK;
    } else {
      return HttpStatus.UNAUTHORIZED;
    }
  }

  async getAllUsers() {
    return this.usersService.getAllUsers();
  }
  async verifyJWTToken() {
    //TODO: check if the user credential matches up with the database
  }

  async generateJWTToken(user) {
    //TODO: Generate the JWT Token and return it
    //Store this in the database also for the user specified
    //Use NestJWT
  }

  async sendJWTToken() {
    //TODO: Send the jwt token in the form of an http only cookie
  }
}
