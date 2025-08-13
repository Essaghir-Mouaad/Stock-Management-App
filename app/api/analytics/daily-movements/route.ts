import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/utils/authClient";
import { getDailyMovements } from "@/app/actions/analyticsActions";

export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");
        const userId = searchParams.get("userId");

        if (!startDate || !endDate) {
            return NextResponse.json({ error: "Start date and end date are required" }, { status: 400 });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
        }

        const dailyMovements = await getDailyMovements(start, end, userId || undefined);

        return NextResponse.json(dailyMovements, { status: 200 });
    } catch (error) {
        console.error("Daily movements API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
} 