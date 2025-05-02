import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken'; // ✅ ADD this

export interface DecodedToken {
  sub: string;
  email?: string;
  exp: number;
}

// ✅ CLIENT-SIDE: For use in the browser (uses js-cookie and jwt-decode)
export function getUserEmailFromToken(): string | null {
  const token = Cookies.get('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.email || null;
  } catch {
    return null;
  }
}

// ✅ SERVER-SIDE: For use in server components (uses jsonwebtoken)
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secure_random_key_here';

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
