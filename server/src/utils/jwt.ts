import jwt from 'jsonwebtoken';

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined.');
  }
  return secret;
};

export interface JwtPayload {
  userId: string;
  email: string;
}

export function generateToken(payload: JwtPayload): string {
  const secret = getJwtSecret();
  return jwt.sign(payload, secret, { expiresIn: '7d' }); 
}

export function verifyToken(token: string): JwtPayload {
  const secret = getJwtSecret();
  const decoded = jwt.verify(token, secret);
  
  if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded && 'email' in decoded) {
    return decoded as JwtPayload;
  }
  throw new Error('Invalid token payload');
}