// utils/authServer.ts
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET || "super_secret_key") as {
      id: string;
      role: string;
      email: string;
      name: string;
    };
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
}
