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

  async createUser(uname: string, pass: string) {
    if (uname === '' || pass === '') {
      console.log('Username or password empty');
      return HttpStatus.BAD_REQUEST;
    }

    let username: string = uname;
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
        username,
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

  async verifyUserCredentials() {
    //TODO: User this in the auth service to check a users credentials
  }

  async getAllUsers(): Promise<Users[]> {
    return this.userRepository.find();
  }
}
