import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  async createUser(uname: string, pass: string) {
    //TODO: Add error checking here
    let username = uname;
    let password = pass;

    const saltRounds = 10;
    const hashedPassword = argon2.hash(password);

    const user = this.userRepository.create({
      username,
      password,
    });
    return this.userRepository.save(user);
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
