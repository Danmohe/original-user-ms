import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { LoginRequest, LoginResponse } from '../../auth.pb';
import { LocalStrategy } from '../strategies/local.strategy';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private localStrategy: LocalStrategy) {}

  @GrpcMethod('AuthService', 'login')
  async signIn(request: LoginRequest): Promise<LoginResponse> {
    try {
      const user = await this.localStrategy.validate(request.userName, request.password);
      return {
        success: true,
        message: 'Authentication successful',
        error: '',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Authentication failed',
        error: (error as Record<string, string>)?.message,
      };
    }
  }
}
