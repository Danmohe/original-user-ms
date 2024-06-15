import { Body, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices/decorators';

import { UsersService } from '../services/users.service';
import { userDto, updateUserDto } from '../dtos/user.dto';
import { UserMSG } from 'src/common/constants';

@ApiTags('Users')
@Controller('api/v1/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @MessagePattern(UserMSG.FIND_ALL)
  async findAll() {
    try {
      const foundUsers = await this.usersService.findAll();
      return {
        success: true,
        message: 'Users found',
        data: foundUsers,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to found users',
        error: (error as Record<string, string>)?.message,
      };
    }
  }

  @MessagePattern(UserMSG.FIND_ONE)
  async findOne(@Payload() id: number) {
    try {
      const foundUser = await this.usersService.findOne(id);
      return {
        success: true,
        message: 'User found',
        data: foundUser,
      };
    } catch (error) {
      return {
        success: false,
        message: 'User not found',
        error: (error as Record<string, string>)?.message,
      };
    }
  }

  @MessagePattern(UserMSG.CREATE)
  async create(@Payload() payload: userDto) {
    try {
      const createdUser = await this.usersService.create(payload);
      console.log('user created');
      return {
        success: true,
        message: 'User created succesfully',
        data: createdUser,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create user',
        error: (error as Record<string, string>)?.message,
      };
    }
  }

  @MessagePattern(UserMSG.UPDATE)
  async update(
    @Payload() message: { userName: string; payload: updateUserDto },
  ) {
    try {
      const updateUser = await this.usersService.update(
        message.userName,
        message.payload,
      );
      console.log('user updated');
      return {
        success: true,
        message: 'User updated succesfully',
        data: updateUser,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update user',
        error: (error as Record<string, string>)?.message,
      };
    }
  }

  @MessagePattern(UserMSG.DELETE)
  async delete(@Payload() userName: string) {
    try {
      const deletedUser = await this.usersService.delete(userName);
      return {
        success: true,
        message: 'User deleted succesfully',
        data: deletedUser,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete user',
        error: (error as Record<string, string>)?.message,
      };
    }
  }

  @MessagePattern('recoverPassword')
  async recoverPassword(@Body() payload: any) {
    try {
      const updatedPassword = await this.usersService.recoverPassword(
        payload.userName,
      );
      return {
        success: true,
        message: 'Recovery password generated succesfully',
        data: updatedPassword,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to generate recovery password',
        error: (error as Record<string, string>)?.message,
      };
    }
  }

  @MessagePattern(UserMSG.JWT)
  async updateJWT(@Payload() message: { userName: string; token: string }) {
    try {
      const updateUser = await this.usersService.updateJWT(
        message.userName,
        message.token,
      );
      console.log('user updated');
      return {
        success: true,
        message: 'JWT updated succesfully',
        data: updateUser,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update JWT',
        error: (error as Record<string, string>)?.message,
      };
    }
  }
}
