export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/utils/authClient";
import { getCurrentStockOverview } from "@/app/actions/analyticsActions";

export async function GET(request: NextRequest) {
    try {
        console.log("Current overview API called");

        const user = await getCurrentUser();
        if (!user) {
            console.log("User not authenticated");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const startDateParam = searchParams.get("startDate");
        const endDateParam = searchParams.get("endDate");
        const userId = searchParams.get("userId");
        const year = searchParams.get("year");
        const month = searchParams.get("month");

        console.log("Parameters:", { userId, startDate: startDateParam, endDate: endDateParam, year, month });

        let currentOverview;

        // Priority 1: Use startDate and endDate if provided
        if (startDateParam && endDateParam) {
            try {
                console.log("Raw date params:", { startDateParam, endDateParam });
                
                // Handle different date formats
                let startDate: Date;
                let endDate: Date;
                
                // Try parsing as ISO string first
                if (startDateParam.includes('T') || startDateParam.includes('Z')) {
                    startDate = new Date(startDateParam);
                    endDate = new Date(endDateParam);
                } else {
                    // If not ISO, try parsing as timestamp or other format
                    startDate = new Date(startDateParam);
                    endDate = new Date(endDateParam);
                }

                console.log("Parsed dates:", { 
                    startDate: startDate.toISOString(), 
                    endDate: endDate.toISOString(),
                    startValid: !isNaN(startDate.getTime()),
                    endValid: !isNaN(endDate.getTime())
                });

                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                    console.log("Invalid date parameters after parsing");
                    return NextResponse.json({ 
                        error: "Invalid date format",
                        received: { startDateParam, endDateParam }
                    }, { status: 400 });
                }

                console.log("Getting overview for date range");
                currentOverview = await getCurrentStockOverview(startDate, endDate, userId || undefined);
            } catch (dateError) {
                console.error("Date parsing error:", dateError);
                return NextResponse.json({ 
                    error: "Date parsing failed",
                    details: dateError instanceof Error ? dateError.message : "Unknown date error"
                }, { status: 400 });
            }
        }
        // Priority 2: Use year and month if provided
        else if (year && month) {
            const yearNum = parseInt(year);
            const monthNum = parseInt(month);

            if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
                console.log("Invalid year or month parameters");
                return NextResponse.json({ error: "Invalid year or month" }, { status: 400 });
            }

            // Create start and end dates for the month
            const startDate = new Date(yearNum, monthNum - 1, 1);
            const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59);

            console.log("Getting monthly overview for:", yearNum, monthNum, {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
            });
            
            currentOverview = await getCurrentStockOverview(startDate, endDate, userId || undefined);
        }
        // Priority 3: Default to current month if no dates provided
        else {
            const now = new Date();
            const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

            console.log("Getting current month overview:", {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
            });
            
            currentOverview = await getCurrentStockOverview(startDate, endDate, userId || undefined);
        }

        console.log("Overview data:", currentOverview);
        return NextResponse.json(currentOverview, { status: 200 });
    } catch (error) {
        console.error("Current overview API error:", error);
        return NextResponse.json({
            error: "Internal server error",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}