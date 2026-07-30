import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../modules/users/users.service';
import { getJwtSecret } from '../config/jwt.config';

interface JwtPayload {
  sub: number;
  type?: 'access' | 'password-reset' | 'refresh';
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: getJwtSecret(),
    });
  }

  async validate(payload: JwtPayload) {
    if (payload.type !== 'access') {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findProfileById(payload.sub);

    if (!user || !user.isActive || !user.userRole?.role) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
