import { getCurrentUser } from "@/app/utils/authClient";
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/app/lib/prisma";
import { error } from "console";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "unauthorrized" }, { status: 401 });
    }

    if (user.role != "WORKER") {
      return NextResponse.json({ error: "Only workers " }, { status: 403 });
    }

    const userProducts = prisma.userProduct.findMany({
      where: {
        createdBy: {
          role: "ADMIN",
        },
      },
      include: {
        productLines: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const invoices = (await userProducts).map(userProduct => ({
      id: userProduct.id,
      name: userProduct.name,
      date: userProduct.createdAt,
      totalItems: userProduct.productLines.length,
      products: userProduct.productLines.map(productLine => ({
        id: productLine.id,
        name: productLine.name,
        currentStock: productLine.currentStock,
        initialStock: productLine.initialStock,
        unit: productLine.unite,
        category: productLine.category,
        quality: productLine.quality,
        unitPrice: productLine.unitPrice,
        minStock: productLine.minStock
      })),
      createdBy: userProduct.createdBy
    }));

    return NextResponse.json(invoices)
  } catch (error) {}
}
