import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/utils/authClient";
import prisma from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const startDateParam = searchParams.get("startDate");
        const endDateParam = searchParams.get("endDate");
        const userId = searchParams.get("userId");

        if (!startDateParam || !endDateParam) {
            return NextResponse.json({ error: "Start date and end date are required" }, { status: 400 });
        }

        const start = new Date(startDateParam);
        const end = new Date(endDateParam);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
        }

        // Build where clause
        const whereClause: any = {
            createdAt: {
                gte: start,
                lte: end,
            },
        };

        if (userId) whereClause.userId = userId;

        const movements = await prisma.stockMovement.findMany({
            where: whereClause,
            include: {
                productLine: {
                    include: { userProduct: true },
                },
                user: true,
            },
            orderBy: { createdAt: 'asc' },
        });

        // Group by date and calculate daily totals
        const dailyData = movements.reduce((acc: any, movement: any) => {
            const date = movement.createdAt.toISOString().split('T')[0];

            if (!acc[date]) {
                acc[date] = {
                    date,
                    stockIn: 0,
                    stockOut: 0,
                    net: 0,
                    movements: [],
                };
            }

            if (movement.movementType === 'IN') {
                acc[date].stockIn += movement.quantity;
                acc[date].net += movement.quantity;
            } else if (movement.movementType === 'OUT') {
                acc[date].stockOut += movement.quantity;
                acc[date].net -= movement.quantity;
            }

            acc[date].movements.push(movement);
            return acc;
        }, {} as any);

        return NextResponse.json(Object.values(dailyData), { status: 200 });
    } catch (error) {
        console.error("Daily movements API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}