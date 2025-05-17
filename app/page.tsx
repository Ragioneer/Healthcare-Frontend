import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DecodedToken, verifyToken } from "@/lib/auth";

export default function Home() {
  const token = cookies().get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  let decoded: DecodedToken;

  try {
    decoded = verifyToken(token) as DecodedToken;
  } catch (err) {
    redirect("/login");
  }

  if (decoded.role === "admin") {
    redirect("/admin/upload-medical-files");
  }

  redirect("/ask-me-anything");
}
