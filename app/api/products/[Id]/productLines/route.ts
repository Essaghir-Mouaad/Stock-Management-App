import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/utils/authClient";
import prisma from "@/app/lib/prisma";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ Id: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const resolvedParams = await params;
        const { Id: invoiceId } = resolvedParams;
        let body;
        try {
            body = await request.json();
        } catch (error) {
            return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
        }

        const {
            name,
            category,
            unitPrice,
            initialStock,
            minStock,
            unite,
            quality
        } = body;

        // Validate required fields
        if (!name || !category || !unite) {
            return NextResponse.json({ error: "Name, category, and unite are required" }, { status: 400 });
        }

        // Check if the invoice exists
        const invoice = await prisma.userProduct.findUnique({
            where: { id: invoiceId },
            include: { productLines: true }
        });

        if (!invoice) {
            return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
        }

        // Create the product line
        const productLine = await prisma.productLine.create({
            data: {
                name,
                category,
                unitPrice: unitPrice || 0,
                initialStock: initialStock || 0,
                currentStock: initialStock || 0,
                minStock: minStock || 0,
                unite,
                quality: quality || 3,
                userProductId: invoiceId
            }
        });

        // Return the updated invoice with all product lines
        const updatedInvoice = await prisma.userProduct.findUnique({
            where: { id: invoiceId },
            include: { productLines: true }
        });

        return NextResponse.json(updatedInvoice, { status: 201});
    } catch (error) {
        console.error("Add product line error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ Id: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const resolvedParams = await params;
        const { Id: invoiceId } = resolvedParams;

        const invoice = await prisma.userProduct.findUnique({
            where: { id: invoiceId },
            include: { productLines: true }
        });

        if (!invoice) {
            return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
        }

        return NextResponse.json(invoice, { status: 200 });
    } catch (error) {
        console.error("Get product lines error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
} 