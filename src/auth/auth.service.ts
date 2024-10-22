import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(email: string, password: string) {
    console.log('email in auth service' + email);
    console.log('passowrd in auth service' + password);
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
    let payload = {
      email2: email,
      password3: password,
    };
    const verified = await this.usersService.verifyUserCredentials(
      email,
      password,
    );
    // console.log('Verified: ' + verified);
    if (verified) {
      const jwtToken = await this.generateJWTToken(payload);
      console.log('JWT Token returned is: ' + jwtToken);
      // const verifiedPayload = await this.verifyJWTToken(jwtToken);
      // console.log('Verified JWT Token: ' + verifiedPayload);
      const stored = await this.storeJWTToken(email, jwtToken);
      return HttpStatus.OK;
    } else {
      return HttpStatus.UNAUTHORIZED;
    }
  }

  async getAllUsers() {
    return this.usersService.getAllUsers();
  }
  async verifyJWTToken(signedPayload) {
    const jwtSecret: Partial<typeof defaultValues> = JSON.parse(
      process.env.JWT_SECRET || '{}',
    );
    console.log('Signed payload being verified: ' + signedPayload);
    let decodedPayload = await this.jwtService.verify(signedPayload, {
      secret: jwtSecret,
    });
    //TODO: Implement error checking here
    //Decoded payload will error if the signature payload cannot be verified correctly
    console.log('decoded payload');
    console.log(decodedPayload);
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
