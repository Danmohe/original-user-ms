import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { AuthService } from '../services/auth.service';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'userName',
    });
  }

  async validate(userName: string, password: string) {
    const user = await this.authService.validateUser(userName, password);
    if (!user) {
      throw new UnauthorizedException('Not allowed');
    }
    return user;
  }
}
