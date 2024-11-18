import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { HttpStatus } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  // Mock the UsersService and JwtService methods since we are focused on testing auth service
  const mockUsersService = {
    createUser: jest.fn(),
    verifyUserCredentials: jest.fn(),
    getUserIdFromEmail: jest.fn(),
    getAllUsers: jest.fn(),
    checkJWTAgainstDB: jest.fn(),
    storeJWTToken: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signup', () => {
    it('should return false for invalid email', async () => {
      const result = await authService.signup('invalid-email', 'password');
      expect(result).toEqual(false);
    });

    it('should call createUser and return the result from it', async () => {
      mockUsersService.createUser.mockResolvedValue(HttpStatus.CREATED);

      const result = await authService.signup('test@example.com', 'password');

      expect(mockUsersService.createUser).toHaveBeenCalledWith(
        'test@example.com',
        'password',
      );
      expect(result).toEqual(true);
    });

    it('should return 400 if user creation fails', async () => {
      mockUsersService.createUser.mockRejectedValue(new Error('Error'));

      const result = await authService.signup('test@example.com', 'password');

      expect(result).toEqual(false);
    });
  });

  describe('signIn', () => {
    it('should return 200 and generate JWT token if credentials are valid', async () => {
      mockUsersService.verifyUserCredentials.mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('mocked-jwt-token');
      mockUsersService.storeJWTToken.mockResolvedValue(undefined);

      const result = await authService.signIn('test@example.com', 'password');

      expect(mockUsersService.verifyUserCredentials).toHaveBeenCalledWith(
        'test@example.com',
        'password',
      );

      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
      expect(mockUsersService.storeJWTToken).toHaveBeenCalledWith(
        'test@example.com',
        'mocked-jwt-token',
      );
      expect(result).toEqual('mocked-jwt-token');
    });

    it('should return 401 if credentials are invalid', async () => {
      mockUsersService.verifyUserCredentials.mockResolvedValue(false);

      const result = await authService.signIn('test@example.com', 'wrong-password');

      expect(result).toBeNull();
    });
  });

  describe('getAllUsers', () => {
    it('should return a list of users', async () => {
      const users = [{ email: 'user1@example.com' }, { email: 'user2@example.com' }];
      mockUsersService.getAllUsers.mockResolvedValue(users);

      const result = await authService.getAllUsers();

      expect(result).toEqual(users);
    });
  });

  describe('verifyJWTToken', () => {
    it('should return true if the JWT token is valid', async () => {
      const decodedToken = { email: 'test@example.com', exp: Date.now() / 1000 + 3600 };
      mockJwtService.verify.mockResolvedValue(decodedToken);
      mockUsersService.checkJWTAgainstDB.mockResolvedValue(true);

      const result = await authService.verifyJWTToken('valid-jwt-token');

      expect(result).toBe(true);
    });

    it('should return false if the JWT token is invalid', async () => {
      mockJwtService.verify.mockRejectedValue(new Error('Invalid token'));
      
      const result = await authService.verifyJWTToken('invalid-jwt-token');

      expect(result).toBe(false);
    });

    it('should return false if JWT token is expired', async () => {
      const decodedToken = { email: 'test@example.com', exp: Date.now() / 1000 - 3600 }; // Expired token
      mockJwtService.verify.mockResolvedValue(decodedToken);
      mockUsersService.checkJWTAgainstDB.mockResolvedValue(true);

      const result = await authService.verifyJWTToken('expired-jwt-token');

      expect(result).toBe(false);
    });
  });
});
