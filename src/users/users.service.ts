import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import * as argon2 from 'argon2';

import { HttpCode, HttpStatus } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  async deleteJWTToken(jwtToken) {
    // TODO: Delete jwt token specified, the token will include the email
    // Use this in conjuction with a logout function
  }

  async createUser(userEmail: string, pass: string) {
    // console.log(userEmail);
    // console.log(pass);
    if (userEmail === '' || pass === '') {
      console.log('Email or password empty');
      return false;
    }
    const email: string = userEmail;
    const password: string = pass;
    let hashedPassword: string;

    try {
      hashedPassword = await argon2.hash(password);
    } catch (error) {
      console.log('Error hashing password: ' + error);
      return false;
    }

    try {
      const user = this.userRepository.create({
        email: email,
        password: hashedPassword,
      });
      await this.userRepository.save(user);
      return true;
    } catch (error) {
      console.log('Error saving new user account: ' + error);
      return false;
    }
  }

  async deleteUser() {
    //TODO: Use this in the auth services to delete a user
  }

  async getUserIdFromEmail(email: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (user) {
        return user.uuid;
      } else {
        console.log('No user matching email');
        return null;
      }
    } catch (error) {
      console.log('Error getting user id from email' + error);
      return null;
    }
  }

  async verifyUserCredentials(email: string, enteredPassword: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
        select: ['password', 'email'],
      });

      if (user) {
        if (await this.verifyUserPassword(enteredPassword, user.password)) {
          return true;
        } else {
          console.log('User password was incorrect');
          return false;
        }
      } else {
        console.log('Failed to find user matching credentials');
        return false;
      }
    } catch (error) {
      console.log('Error getting user credentials' + error);
      return false;
    }
  }

  async verifyUserPassword(
    enteredPassword: string,
    storedHashedPassword: string,
  ) {
    if (await argon2.verify(storedHashedPassword, enteredPassword)) {
      return true;
    } else {
      return false;
    }
  }

  async checkJWTAgainstDB(jwtToken, email) {
    return await this.userRepository.findOne({
      where: { email: email, jwtToken: jwtToken },
    });
  }

  async getAllUsers(): Promise<Users[]> {
    return this.userRepository.find();
  }
  async storeJWTToken(userEmail, jwtTokenEncoded) {
    try {
      const user = await this.getUserFromEmail(userEmail);
      user.jwtToken = jwtTokenEncoded;
      return this.userRepository.save(user);
    } catch (error) {
      console.log('Error storing JWT Token: ' + error);
    }
  }

  async getUserFromEmail(email) {
    return await this.userRepository.findOne({
      where: { email: email },
    });
  }
}
