import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/app/actions/userActions";

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, name, role } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ success: false, message: "Username and password are required" }, { status: 400 });
    }

    const result = await createUser(username, email, password, name, role);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    console.error("Register API error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
