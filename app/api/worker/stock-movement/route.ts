import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/app/utils/authClient";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "WORKER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity, reason, userProductId } = await request.json();

    if (!productId || !quantity || !reason) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get current product line stock
    const productLine = await prisma.productLine.findUnique({
      where: { id: productId },
      include: {
        userProduct: true,
      },
    });

    if (!productLine) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const quantityFloat = parseFloat(quantity);

    if (quantityFloat > productLine.currentStock) {
      return NextResponse.json(
        {
          error: "Insufficient stock",
        },
        { status: 400 }
      );
    }

    // Create stock movement record
    const stockMovement = await prisma.stockMovement.create({
      data: {
        userId: user.id,
        productLineId: productId,
        userProductId: userProductId || productLine.userProductId,
        quantity: quantityFloat,
        reason,
        movementType: "OUT", // Assuming you have this field
        previousStock: productLine.currentStock,
        newStock: productLine.currentStock - quantityFloat,
      },
    });

    // Update product line stock
    await prisma.productLine.update({
      where: { id: productId },
      data: {
        currentStock: productLine.currentStock - quantityFloat,
      },
    });

    return NextResponse.json({
      success: true,
      stockMovement,
      message: "Stock movement recorded successfully",
    });
  } catch (error) {
    console.error("Error recording stock movement:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
