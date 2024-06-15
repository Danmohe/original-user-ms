// src/auth/services/auth.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../../user/services/users.service';
import * as bcrypt from 'bcrypt';
import { User, userRole } from '../../user/entities/users.entity';

const mockUser: User = {
  id: 1,
  jwt: 'testToken',
  name: 'Test',
  lastName: 'User',
  userName: 'TestUser',
  password: 'hashedPassword',
  email: 'test@example.com',
  role: userRole.DEVELOPER,
  createAt: new Date(),
  updateAt: new Date(),
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByUserName: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user if validation is successful', async () => {
      jest.spyOn(usersService, 'findByUserName').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.validateUser('TestUser', 'password');
      expect(result).toEqual(mockUser);
    });

    it('should return null if user is not found', async () => {
      jest.spyOn(usersService, 'findByUserName').mockResolvedValue(null);

      const result = await service.validateUser('NonExistentUser', 'password');
      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
      jest.spyOn(usersService, 'findByUserName').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      const result = await service.validateUser('TestUser', 'wrongPassword');
      expect(result).toBeNull();
    });
  });
});
