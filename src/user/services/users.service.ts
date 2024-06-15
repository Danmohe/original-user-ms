import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as generator from 'generate-password';

import { User } from '../entities/users.entity';
import { userDto, updateUserDto } from '../dtos/user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async findAll() {
    return this.userRepo.find();
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async findByUserName(userName: string) {
    return await this.userRepo.findOne({ where: { userName } });
  }

  async create(payload: userDto) {
    const newUser = this.userRepo.create(payload);
    const hashPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashPassword;
    return await this.userRepo.save(newUser).catch((error) => {
      throw new ConflictException(error.detail);
    });
  }

  async update(userName: string, payload: updateUserDto) {
    const user = await this.userRepo.findOneBy({ userName });
    if (!user) {
      throw new NotFoundException(`User ${userName} not found`);
    }
    this.userRepo.merge(user, payload);
    return await this.userRepo.save(user).catch((error) => {
      throw new ConflictException(error.detail);
    });
  }

  async delete(userName: string) {
    const user = await this.userRepo.findOneBy({ userName });
    if (!user) {
      throw new NotFoundException(`User ${userName} not found`);
    }
    this.userRepo.delete({ userName });
    return user;
  }

  async recoverPassword(userName: string) {
    const user = await this.userRepo.findOne({ where: { userName } });
    if (!user) {
      throw new NotFoundException(`User ${userName} not found`);
    }
    const generatedPassword = generator.generate({
      length: 8,
      uppercase: true,
      numbers: true,
      symbols: '*',
      strict: true,
    });
    const hashPassword = await bcrypt.hash(generatedPassword, 10);
    user.password = hashPassword;
    await this.userRepo.save(user).catch((error) => {
      throw new ConflictException(error.detail);
    });
    return generatedPassword;
  }

  async updateJWT(userName: string, token: string) {
    const user = await this.userRepo.findOneBy({ userName });
    if (!user) {
      throw new NotFoundException(`User ${userName} not found`);
    }
    user.jwt = token;
    return await this.userRepo.save(user);
  }
}
