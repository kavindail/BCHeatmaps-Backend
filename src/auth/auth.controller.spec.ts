import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let mockResponse: Partial<Response>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          // use the mock one, not real service
          useValue: {
            signup: jest.fn(),
            signIn: jest.fn(),
            getAllUsers: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    // create mock response object
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    };
  });

  // testing authentication signUp
  describe('signUp', () => {
    it('should return 201 and create user successfully', async () => {
      const userDetails = { email: 'test@example.com', password: 'password' };
      (authService.signup as jest.Mock).mockResolvedValue(HttpStatus.CREATED);

      await authController.signUp(userDetails, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User signed up succesfully.' });
    });

    it('should return 400 for invalid email', async () => {
      const userDetails = { email: 'invalid-email', password: 'password' };
      (authService.signup as jest.Mock).mockResolvedValue(null);

      await authController.signUp(userDetails, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid email or signup failed.' });
    });

  });

  // testing authentication signIn
  describe('signIn', () => {
    it('should sign in successfully and return a token', async () => {
        const userDetails = { email: 'test@example.com', password: 'password' };
    
        // Mock the AuthService signIn to return a successful response
        (authService.signIn as jest.Mock).mockResolvedValue(HttpStatus.OK);
    
        await authController.signIn(userDetails, mockResponse as Response);
    
        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
    });
    
  });
  
  // testing authentication get All users method
  describe('getAllUsers', () => {
    it('should return an array of users as a JSON string', async () => {
      const users = [{ email: 'user1@example.com' }, { email: 'user2@example.com' }];
      (authService.getAllUsers as jest.Mock).mockResolvedValue(users);
  
      const result = await authController.getAllUsers();
  
      expect(result).toEqual(JSON.stringify(users)); 
      expect(authService.getAllUsers).toHaveBeenCalled();
    });
  
    it('should return an empty array as a JSON string when no users exist', async () => {
      const users: any = []; // Empty array for no users
      (authService.getAllUsers as jest.Mock).mockResolvedValue(users);
  
      const result = await authController.getAllUsers();
  
      expect(result).toEqual(JSON.stringify(users));
      expect(authService.getAllUsers).toHaveBeenCalled();
    });
  });


});
