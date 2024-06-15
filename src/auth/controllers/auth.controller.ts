import { Body, Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { LocalStrategy } from '../strategies/local.strategy';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private localStrategy: LocalStrategy) {}

  @MessagePattern('login')
  async signIn(@Body() body: { userName: string; password: string }) {
    try {
      const user = await this.localStrategy.validate(
        body.userName,
        body.password,
      );
      return user;
    } catch (error) {
      return {
        success: false,
        message: 'Authentication failed',
        error: (error as Record<string, string>)?.message,
      };
    }
  }
}
