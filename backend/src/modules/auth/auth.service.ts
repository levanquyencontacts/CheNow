import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Users } from '../users/users.entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
}

interface RefreshTokenPayload {
  email: string;
  sub: number;
  type: 'refresh';
}

const REFRESH_TOKEN_EXPIRES_IN = '7d';
const REFRESH_TOKEN_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async validateUser(email: string, password: string): Promise<Users> {
    const user = await this.usersService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('sai tai khoan hoac mat khau');
    }
    return user;
  }

  async register(user: Partial<Users>): Promise<AuthResponse> {
    const newUser = await this.usersService.create(user);
    return this.login(newUser);
  }

  async login(user: Users): Promise<AuthResponse> {
    return this.issueTokenPair(user);
  }

  async refresh(refreshToken?: string): Promise<RefreshTokenResponse> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token la bat buoc');
    }

    const payload = this.verifyRefreshToken(refreshToken);
    const storedToken = await this.refreshTokenRepository.findOneBy({
      refresh_token: refreshToken,
    });

    if (
      !storedToken ||
      storedToken.revokedAt ||
      storedToken.expiresAt.getTime() <= Date.now()
    ) {
      throw new UnauthorizedException('Refresh token khong hop le');
    }

    const user = await this.usersService.findProfileById(payload.sub);
    if (!user || user.email !== payload.email || !user.isActive) {
      throw new UnauthorizedException('Refresh token khong hop le');
    }

    return {
      access_token: this.signAccessToken(user),
    };
  }

  async logout(refreshToken?: string): Promise<void> {
    if (!refreshToken) {
      return;
    }

    try {
      await this.refreshTokenRepository.update(
        { refresh_token: refreshToken },
        { revokedAt: new Date() },
      );
    } catch {
      // Logout remains idempotent when the token is already invalid or expired.
    }
  }

  private async issueTokenPair(user: Users): Promise<AuthResponse> {
    const payload = { email: user.email, sub: user.id };
    const refreshToken = this.jwtService.sign(
      { ...payload, type: 'refresh' },
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN },
    );

    await this.refreshTokenRepository.save(
      this.refreshTokenRepository.create({
        refresh_token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_LIFETIME_MS),
      }),
    );

    return {
      access_token: this.signAccessToken(user),
      refresh_token: refreshToken,
    };
  }

  private verifyRefreshToken(refreshToken?: string): RefreshTokenPayload {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token la bat buoc');
    }

    try {
      const payload = this.jwtService.verify<RefreshTokenPayload>(refreshToken);
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Refresh token khong hop le');
      }
      return payload;
    } catch {
      throw new UnauthorizedException('Refresh token khong hop le');
    }
  }

  private signAccessToken(user: Users): string {
    return this.jwtService.sign({ email: user.email, sub: user.id });
  }
}
