import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
// import { JwtService } from '@nestjs/jwt';

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
    const verified = this.usersService.verifyUserCredentials(email, password);
    if (verified) {
      //TODO: Generate JWT Token and return to the user
      return;
    } else {
      return HttpStatus.BAD_REQUEST;
    }
  }

  async getAllUsers() {
    return this.usersService.getAllUsers();
  }
  async verifyJWTToken() {
    //TODO: check if the user credential matches up with the database
  }

  async sendJWTToken() {
    //TODO: Send the user a new jwt token that they will store
    //Use nestjwt module
  }
}
