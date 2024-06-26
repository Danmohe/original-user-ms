import { Injectable } from '@nestjs/common';
import { UsersService } from '../../user/services/users.service'; // Adjust the path as necessary
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) { }

  async validateUser(userName: string, password: string) {
    const user = await this.usersService.findByUserName(userName);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return user;
      }
    }
    return null;
  }
}
