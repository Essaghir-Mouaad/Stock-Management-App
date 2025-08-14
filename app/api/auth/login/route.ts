import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/app/actions/userActions";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ success: false, message: "Username and password are required" }, { status: 400 });
    }

    const result = await loginUser(username, password);

    if (result.success) {
      const response = NextResponse.json(result, { status: 200 });
      if (typeof result.token === "string") {
        response.cookies.set("token", result.token, { httpOnly: true, path: "/", maxAge: 86400 });
      }
      return response;
    }

    return NextResponse.json(result, { status: 401 });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
