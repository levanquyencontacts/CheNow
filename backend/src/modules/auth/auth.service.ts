import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Users } from '../users/users.entities';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, QueryFailedError, Repository } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';
import * as bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { RoleCode } from '../../common/enums/common.enum';
import {
  AuthResponse,
  RefreshTokenResponse,
} from '../../common/types/user-response.type';
import { Role } from '../roles/entities/role.entity';
import { UserRole } from '../roles/entities/user-role.entity';
import { CustomerProfile } from '../customers/entities/customer-profile.entity';
import { RegisterDto } from './dto/register.dto';

interface RefreshTokenPayload {
  email: string;
  sub: number;
  type: 'refresh';
}

interface PasswordResetPayload {
  email: string;
  sub: number;
  type: 'password-reset';
}

const REFRESH_TOKEN_EXPIRES_IN = '7d';
const REFRESH_TOKEN_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;
const PASSWORD_RESET_TOKEN_EXPIRES_IN = '15m';
const PASSWORD_RESET_SUCCESS_MESSAGE =
  'Neu email ton tai, link dat lai mat khau da duoc gui';
const bcryptService = bcrypt as unknown as {
  hash(password: string, saltRounds: number): Promise<string>;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly dataSource: DataSource,
  ) {}

  async validateUser(email: string, password: string): Promise<Users> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email khong ton tai');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('Tai khoan khong hoat dong');
    }

    const validatedUser = await this.usersService.validateUser(email, password);
    if (!validatedUser) {
      throw new UnauthorizedException('Mat khau khong dung');
    }

    const authUser = await this.usersService.findProfileById(validatedUser.id);
    if (!authUser?.isActive || !authUser.userRole?.role) {
      throw new UnauthorizedException('Tai khoan khong co role hop le');
    }

    return authUser;
  }

  async register(user: RegisterDto): Promise<AuthResponse> {
    const normalizedEmail = user.email.trim().toLowerCase();
    let newUserId: number;

    try {
      newUserId = await this.dataSource.transaction(async (manager) => {
        const existing = await manager
          .createQueryBuilder(Users, 'user')
          .where('LOWER(user.email) = :email', { email: normalizedEmail })
          .getOne();
        if (existing) {
          throw new ConflictException('Email already exists');
        }

        const password = await bcryptService.hash(user.password, 10);
        const newUser = await manager.save(
          Users,
          manager.create(Users, {
            email: normalizedEmail,
            fullName: user.fullName,
            phone: user.phone,
            password,
          }),
        );
        const customerRole = await manager.findOne(Role, {
          where: { code: RoleCode.CUSTOMER },
        });
        if (!customerRole) {
          throw new BadRequestException('Customer role does not exist');
        }

        await manager.save(
          UserRole,
          manager.create(UserRole, {
            userId: newUser.id,
            roleId: customerRole.id,
          }),
        );
        await manager.save(
          CustomerProfile,
          manager.create(CustomerProfile, { userId: newUser.id }),
        );
        return newUser.id;
      });
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error.driverError as { code?: string }).code === '23505'
      ) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }

    const createdUser = await this.usersService.findProfileById(newUserId);

    if (!createdUser) {
      throw new BadRequestException('Tao tai khoan khong thanh cong');
    }

    return this.login(createdUser);
  }

  async login(user: Users): Promise<AuthResponse> {
    const authUser = await this.usersService.findProfileById(user.id);

    if (!authUser?.isActive || !authUser.userRole?.role) {
      throw new UnauthorizedException('Tai khoan khong hop le');
    }

    return this.issueTokenPair(authUser);
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
    if (
      !user ||
      user.email !== payload.email ||
      !user.isActive ||
      !user.userRole?.role
    ) {
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

  async forgotPassword(email: string): Promise<{ message: string }> {
    const normalizedEmail = email.trim();
    const user = await this.usersService.findByEmail(normalizedEmail);

    if (!user || !user.isActive) {
      return { message: PASSWORD_RESET_SUCCESS_MESSAGE };
    }

    const resetToken = this.jwtService.sign(
      { email: user.email, sub: user.id, type: 'password-reset' },
      { expiresIn: PASSWORD_RESET_TOKEN_EXPIRES_IN },
    );

    await this.sendPasswordResetEmail(user.email, resetToken);

    return { message: PASSWORD_RESET_SUCCESS_MESSAGE };
  }

  async resetPassword(
    token: string,
    password: string,
  ): Promise<{ message: string }> {
    const payload = this.verifyPasswordResetToken(token);
    const user = await this.usersService.findByEmail(payload.email);

    if (!user || user.id !== payload.sub || !user.isActive) {
      throw new BadRequestException('Token dat lai mat khau khong hop le');
    }

    const passwordHash = await bcryptService.hash(password, 10);
    await this.usersService.updatePassword(user.id, passwordHash);

    const revokedAt = new Date();
    await this.refreshTokenRepository.update(
      { userId: user.id, revokedAt: IsNull() },
      { revokedAt },
    );

    return { message: 'Dat lai mat khau thanh cong' };
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
      user: this.usersService.toProfileResponse(user),
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
    return this.jwtService.sign({
      email: user.email,
      sub: user.id,
      type: 'access',
    });
  }

  private verifyPasswordResetToken(token: string): PasswordResetPayload {
    try {
      const payload = this.jwtService.verify<PasswordResetPayload>(token);
      if (payload.type !== 'password-reset') {
        throw new BadRequestException('Token dat lai mat khau khong hop le');
      }
      return payload;
    } catch {
      throw new BadRequestException('Token dat lai mat khau khong hop le');
    }
  }

  private async sendPasswordResetEmail(
    email: string,
    token: string,
  ): Promise<void> {
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
    const resetUrl = `${frontendUrl.replace(/\/$/, '')}/reset-password?token=${token}`;

    if (!process.env.SMTP_HOST) {
      console.log(`Password reset link for ${email}: ${resetUrl}`);
      return;
    }

    const port = Number(process.env.SMTP_PORT ?? 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: process.env.SMTP_SECURE === 'true',
      auth: user && pass ? { user, pass } : undefined,
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? 'Quan Che <no-reply@quanche.local>',
      to: email,
      subject: 'Dat lai mat khau Quan Che',
      text: `Ban vua yeu cau dat lai mat khau. Truy cap link sau trong 30 phut: ${resetUrl}`,
      html: `
        <p>Ban vua yeu cau dat lai mat khau Quan Che.</p>
        <p>Link nay co hieu luc trong 30 phut.</p>
        <p><a href="${resetUrl}">Dat lai mat khau</a></p>
      `,
    });
  }
}
