import { getCurrentUser } from "@/app/utils/authClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    // Fixed the logical error in the condition
    if (!user || !user.name || !user.email) {
      return NextResponse.json(
        { error: "Sorry, no user exists or user data is incomplete" }, 
        { status: 401 }
      );
    }

    // Return only the necessary user info
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching user info:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}
