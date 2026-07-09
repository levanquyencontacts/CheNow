import { SignOptions } from 'jsonwebtoken';

export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is required');
  }

  return secret;
};

export const getJwtExpiresIn = (): SignOptions['expiresIn'] =>
  (process.env.JWT_EXPIRES_IN ?? '1h') as SignOptions['expiresIn'];
