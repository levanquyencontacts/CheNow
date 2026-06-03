import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  handleRequest<TUser = unknown>(err: unknown, user: TUser): TUser {
    if (err instanceof Error) {
      throw err;
    }

    if (!user) {
      throw new UnauthorizedException('Dang nhap khong thanh cong');
    }

    return user;
  }
}
