export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/utils/authClient";
import { deleteProductLine, updateProductLine } from "@/app/actions/productActions";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ Id: string; productLineId: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const resolvedParams = await params;
        const { productLineId } = resolvedParams;

        if (!productLineId) {
            return NextResponse.json({ error: "Product line ID is required" }, { status: 400 });
        }

        await deleteProductLine(productLineId);

        return NextResponse.json({ message: "Product line deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Delete product line error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ Id: string; productLineId: string }> }
) {
    try {
        console.log("PUT request received for product line update");
        
        const user = await getCurrentUser();
        if (!user) {
            console.log("User not authenticated");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const resolvedParams = await params;
        const { productLineId } = resolvedParams;
        console.log("Product line ID:", productLineId);

        if (!productLineId) {
            return NextResponse.json({ error: "Product line ID is required" }, { status: 400 });
        }

        let body;
        try {
            body = await request.json();
            console.log("Request body:", body);
        } catch (error) {
            console.error("JSON parse error:", error);
            return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
        }

        console.log("Calling updateProductLine with:", productLineId, body);
        const updatedProductLine = await updateProductLine(productLineId, body);
        console.log("Updated product line:", updatedProductLine);

        return NextResponse.json(updatedProductLine, { status: 200 });
    } catch (error) {
        console.error("Update product line error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
} 