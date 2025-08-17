export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/utils/authClient";
import { getMonthlySummary } from "@/app/actions/analyticsActions";

export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const year = searchParams.get("year");
        const month = searchParams.get("month");
        const userId = searchParams.get("userId");

        if (!year || !month) {
            return NextResponse.json({ error: "Year and month are required" }, { status: 400 });
        }

        const yearNum = parseInt(year);
        const monthNum = parseInt(month);

        if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
            return NextResponse.json({ error: "Invalid year or month" }, { status: 400 });
        }

        const monthlySummary = await getMonthlySummary(yearNum, monthNum, userId || undefined);

        return NextResponse.json(monthlySummary, { status: 200 });
    } catch (error) {
        console.error("Monthly summary API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
} 