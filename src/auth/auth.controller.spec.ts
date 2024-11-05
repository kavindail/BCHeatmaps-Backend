import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let mockResponse: Partial<Response>;


  describe('signUp', () => {
    it('should return 201 and create user successfully', async () => {
      const userDetails = { email: 'test@example.com', password: 'password' };
      (authService.signup as jest.Mock).mockResolvedValue(HttpStatus.CREATED);

      await authController.signUp(userDetails, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User created succesfully.' });
    });

    it('should return 400 for invalid email', async () => {
      const userDetails = { email: 'invalid-email', password: 'password' };
      (authService.signup as jest.Mock).mockResolvedValue(HttpStatus.BAD_REQUEST);

      await authController.signUp(userDetails, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid email or signup failed.' });
    });

  });

  
});
