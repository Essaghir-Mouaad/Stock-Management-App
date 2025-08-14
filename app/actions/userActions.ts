"use server";

import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "super_secret_key";

// Create account
export async function createUser(
  username: string,
  email: string,
  password: string,
  name: string,
  role: string = "WORKER"
) {
  try {
    const existingUser = await prisma.user.findUnique({ where: { username } });

    if (existingUser) {
      return { success: false, message: "Username already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { username, email, passwordHash: hashedPassword, name, role },
    });

    return { success: true, user: newUser };
  } catch (error: any) {
    console.error("Create user error:", error.message || error);
    return { success: false, message: "Database operation failed" };
  }
}

// Login
export async function loginUser(username: string, password: string) {
  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return { success: false, message: "Invalid username or password" };
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return { success: false, message: "Invalid username or password" };
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
        name: user.name, 
      },
      SECRET,
      { expiresIn: "1d" }
    );

    return {
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    };
  } catch (error: any) {
    console.error("Login user error:", error.message || error);
    return { success: false, message: "Database operation failed" };
  }
}
