// lib/auth.ts
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

export interface DecodedToken {
  sub: string; // email
  exp: number;
}

export function getUserEmailFromToken(): string | null {
  const token = Cookies.get("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.sub;
  } catch {
    return null;
  }
}
