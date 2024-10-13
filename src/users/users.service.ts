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

  async createUser(userEmail: string, pass: string) {
    if (userEmail === '' || pass === '') {
      console.log('Email or password empty');
      return HttpStatus.BAD_REQUEST;
    }

    let email: string = userEmail;
    let password: string = pass;

    let hashedPassword: string;
    try {
      hashedPassword = await argon2.hash(password);
    } catch (error) {
      console.log('Error hashing password: ' + error);
      return HttpStatus.BAD_REQUEST;
    }

    try {
      const user = this.userRepository.create({
        email: email,
        password: hashedPassword,
      });
      await this.userRepository.save(user);
      return HttpStatus.CREATED;
    } catch (error) {
      console.log('Error saving new user account: ' + error);
      return HttpStatus.BAD_REQUEST;
    }
  }

  async deleteUser() {
    //TODO: Use this in the auth services to delete a user
  }

  async verifyUserCredentials(email: string, password: string) {
    //TODO: User this in the auth service to check a users credentials

    try {
      const user = await this.userRepository.findOne({
        where: { email },
        select: ['password'],
      });
      if (user) {
        console.log(user.email);
        //TODO: Now process and check if the user password matches
        //Call verifyUserPassword and then proceed with processing
      } else {
        console.log('Failed to find user matching credentials');
        return false;
      }
    } catch (error) {
      console.log('Error getting user credentials' + error);
      return false;
    }
  }
  async verifyUserPassword() {}

  async getAllUsers(): Promise<Users[]> {
    return this.userRepository.find();
  }
}
