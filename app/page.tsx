import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DecodedToken, verifyToken } from "@/lib/auth";
import { JwtPayload } from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";

interface ExtendedJwtPayload extends JwtPayload {
  email?: string;
}
export default function Home() {
  const token = cookies().get("token")?.value;
  const user = token ? (verifyToken(token) as ExtendedJwtPayload) : null;
  const decoded = jwtDecode<DecodedToken>(token ?? "");

  if (!user || !user.email) {
    redirect("/login");
  }
  if (user && decoded.role !== "admin") {
    redirect("/ask-me-anything");
  }

  if (user && decoded.role === "admin") {
    redirect("/admin/upload-medical-files");
  }
  return null;
}
