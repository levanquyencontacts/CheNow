import type {
  CustomerProfile,
  Users,
} from '../../modules/users/entity/users.entity';
import type { UserRole } from '../enums/common.enum';

export interface AuthRequest {
  user: Users;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
}

export interface RefreshTokenResponse {
  access_token: string;
}

export interface AuthUser {
  id: number;
  email: string;
  fullName?: string | null;
  phone?: string | null;
  avatar?: string | null;
  roles: UserRole[];
  isActive: boolean;
  customerProfile?: CustomerProfile | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface RefreshTokenPayload {
  email: string;
  sub: number;
  roles?: UserRole[];
  type: 'refresh';
}

export interface PasswordResetPayload {
  email: string;
  sub: number;
  type: 'password-reset';
}
