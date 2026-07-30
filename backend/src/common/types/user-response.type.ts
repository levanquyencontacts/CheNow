import { CustomerRank, Gender, RoleCode } from '../enums/common.enum';

export interface UserProfileRoleResponse {
  id: number;
  code: RoleCode;
  name: string;
}

export interface UserProfileResponse {
  id: number;
  email: string;
  fullName: string | null;
  phone: string | null;
  isActive: boolean;
  avatar: string | null;
  role: UserProfileRoleResponse;
  customerProfile: {
    id: number;
    gender: Gender | null;
    points: number;
    rank: CustomerRank;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: UserProfileResponse;
}

export interface RefreshTokenResponse {
  access_token: string;
}
