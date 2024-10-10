import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor() {}

  async createUser() {
    //TODO: Use this in the auth services to create a user
  }
  async deleteUser() {
    //TODO: Use this in the auth services to delete a user
  }

  async verifyUserCredentials() {
    //TODO: User this in the auth service to check a users credentials
  }
}
