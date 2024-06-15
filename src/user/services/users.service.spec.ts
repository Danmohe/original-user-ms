//src/user/services/users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User, userRole } from '../entities/users.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { userDto } from '../dtos/user.dto';
import { updateUserDto } from '../dtos/user.dto';
import * as bcrypt from 'bcrypt';
import * as generator from 'generate-password';

const mockUser: User = {
  id: 1,
  jwt: 'testToken',
  name: 'Test',
  lastName: 'User',
  userName: 'TestUser',
  password: 'testPassword',
  email: 'test@example.com',
  role: userRole.DEVELOPER,
  createAt: new Date(),
  updateAt: new Date(),
};
const mockNewUser: userDto = {
  name: 'New',
  lastName: 'User',
  userName: 'NewUser',
  password: 'newPassword',
  email: 'newuser@example.com',
};

describe('UsersService', () => {
  let service: UsersService;
  let userRepo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = [mockUser];
      jest.spyOn(userRepo, 'find').mockResolvedValue(result);
      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(mockUser);
      expect(await service.findOne(1)).toBe(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByUserName', () => {
    it('should return a user if found', async () => {
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUser);
      expect(await service.findByUserName('TestUser')).toBe(mockUser);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const savedUser = {
        ...mockUser,
        ...mockNewUser,
        password: 'hashedPassword',
      };
      jest.spyOn(userRepo, 'create').mockReturnValue(savedUser as User);
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(async () => 'hashedPassword');
      jest.spyOn(userRepo, 'save').mockResolvedValue(savedUser);

      expect(await service.create(mockNewUser)).toBe(savedUser);
    });

    it('should throw ConflictException if there is an error saving the user', async () => {
      jest.spyOn(userRepo, 'create').mockReturnValue(mockNewUser as User);
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(async () => 'hashedPassword');
      jest.spyOn(userRepo, 'save').mockRejectedValue({ detail: 'error' });

      await expect(service.create(mockNewUser)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('update', () => {
    const updateUserDto: updateUserDto = { name: 'Updated', lastName: 'User' };
    const updatedUser = { ...mockUser, ...updateUserDto };

    it('should update a user', async () => {
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(mockUser);
      jest.spyOn(userRepo, 'merge').mockReturnValue(updatedUser);
      jest.spyOn(userRepo, 'save').mockResolvedValue(updatedUser);
      expect(await service.update('TestUser', updateUserDto)).toBe(updatedUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null);
      await expect(
        service.update('NonExistentUser', updateUserDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if there is an error saving the user', async () => {
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(mockUser);
      jest.spyOn(userRepo, 'merge').mockReturnValue(updatedUser);
      jest.spyOn(userRepo, 'save').mockRejectedValue({ detail: 'error' });
      await expect(service.update('TestUser', updateUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(mockUser);
      jest.spyOn(userRepo, 'delete').mockResolvedValue({ affected: 1 } as any);

      expect(await service.delete('TestUser')).toBe(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null);

      await expect(service.delete('NonExistentUser')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('recoverPassword', () => {
    it('should generate a new password and update the user', async () => {
      const newPassword = 'new*Password1';
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(generator, 'generate').mockReturnValue(newPassword);
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(async () => 'hashedNewPassword');
      jest
        .spyOn(userRepo, 'save')
        .mockResolvedValue({ ...mockUser, password: 'hashedNewPassword' });

      expect(await service.recoverPassword('TestUser')).toBe(newPassword);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);

      await expect(service.recoverPassword('NonExistentUser')).rejects.toThrow(
        NotFoundException,
      );
    });
    it('should throw ConflictException if there is an error saving the user', async () => {
      const newPassword = 'new*Password1';
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(generator, 'generate').mockReturnValue(newPassword);
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(async () => 'hashedNewPassword');
      jest.spyOn(userRepo, 'save').mockRejectedValue({ detail: 'error' });

      await expect(service.recoverPassword('TestUser')).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('updateJWT', () => {
    const newToken = 'newJWTToken';

    it('should update the JWT for a user', async () => {
      const updatedUser = { ...mockUser, jwt: newToken };
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(mockUser);
      jest.spyOn(userRepo, 'save').mockResolvedValue(updatedUser);

      expect(await service.updateJWT('TestUser', newToken)).toBe(updatedUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null);

      await expect(
        service.updateJWT('NonExistentUser', newToken),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
