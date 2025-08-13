import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/app/utils/authClient";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requestBody = await request.json();
    console.log("Received request body:", requestBody);

    const { 
      productId, 
      initialStock, 
      currentStock, 
      userProductId,
      movementType: providedMovementType,
      reason: providedReason,
      quantity: providedQuantity
    } = requestBody;

    // Validate required parameters
    if (!productId || initialStock === undefined || currentStock === undefined || !userProductId) {
      return NextResponse.json(
        { error: "Missing required fields: productId, initialStock, currentStock, userProductId" },
        { status: 400 }
      );
    }

    // Validate that the product exists
    const productLine = await prisma.productLine.findUnique({
      where: { id: productId },
      include: { userProduct: true },
    });

    if (!productLine) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const newStockFloat = parseFloat(initialStock.toString());
    const previousStockFloat = parseFloat(currentStock.toString());

    // Validate numbers
    if (isNaN(newStockFloat) || newStockFloat < 0 || isNaN(previousStockFloat) || previousStockFloat < 0) {
      return NextResponse.json(
        { error: "Invalid stock values" },
        { status: 400 }
      );
    }

    // Calculate movement details
    const quantityChange = Math.abs(newStockFloat - previousStockFloat);
    const movementType = providedMovementType || (newStockFloat >= previousStockFloat ? "IN" : "OUT");
    
    let reason = providedReason;
    if (!reason) {
      if (previousStockFloat === 0) {
        reason = "INITIAL_STOCK";
      } else if (newStockFloat > previousStockFloat) {
        reason = "STOCK_ADDITION";
      } else {
        reason = "STOCK_CONSUMPTION";
      }
    }

    const quantity = providedQuantity || quantityChange;

    console.log("Movement details:", {
      previousStock: previousStockFloat,
      newStock: newStockFloat,
      quantity,
      movementType,
      reason
    });

    // Create stock movement record
    const stockMovement = await prisma.stockMovement.create({
      data: {
        userId: user.id,
        productLineId: productId,
        userProductId: userProductId,
        previousStock: previousStockFloat,
        newStock: newStockFloat,
        quantity: quantity,
        movementType: movementType,
        reason: reason,
        createdAt: new Date(),
      },
    });

    // Update product line current stock
    await prisma.productLine.update({
      where: { id: productId },
      data: {
        currentStock: newStockFloat,
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
      { error: "Internal server error"},
      { status: 500 }
    );
  }
}