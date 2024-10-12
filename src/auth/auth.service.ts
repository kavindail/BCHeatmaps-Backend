import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
// import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    // private jwtService: JwtService,
  ) {}

  async signup(username: string, password: string) {
    const user = await this.usersService.createUser(username, password);
    return user;
  }

  async signIn(username: string, password: string) {
    // TODO: Check if the user's credentials match up with credentials stored
    // Check users credentials from the user service
  }

  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  async sendJWTToken() {
    //TODO: Send the user a new jwt token that they will store
    //Use nestjwt module
    //Once the user signs in send them an http only cookie with the jwtToken included
  }
}
