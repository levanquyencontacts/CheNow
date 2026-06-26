import type { CustomerGender, UserRole } from '../enums/common.enum';

export interface CreateUserInput {
  email?: string;
  fullName?: string;
  phone?: string;
  password?: string;
  avatar?: string | null;
  role?: UserRole;
  roles?: UserRole[];
}

export interface UpdateUserProfileInput {
  email?: string;
  fullName?: string;
  phone?: string;
  avatar?: string | null;
  birthday?: string | null;
  gender?: CustomerGender | null;
}

export interface UpdateUserInput {
  email?: string;
  fullName?: string;
  phone?: string;
  avatar?: string | null;
}

export interface UpsertUserAddressInput {
  receiverName?: string;
  receiverPhone?: string;
  address?: string;
  isDefault?: boolean;
}
