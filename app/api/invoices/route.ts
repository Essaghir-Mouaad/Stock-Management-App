import { NextResponse } from "next/server";
import { getInvoiceProductByEmail, initialiseProductInvoice } from "@/app/actions/productActions";
import { getCurrentUser } from "@/app/utils/authClient";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const invoices = await getInvoiceProductByEmail(user.email);
    return NextResponse.json(invoices, { status: 200 });
  } catch (error) {
    console.error("Get invoices error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
    }

    const { name } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: "Invoice name is required" }, { status: 400 });
    }

    if (name.trim().length > 20) {
      return NextResponse.json({ error: "Invoice name must be 20 characters or less" }, { status: 400 });
    }

    const result = await initialiseProductInvoice(user.email, name.trim());
    
    if (!result) {
      return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Create invoice error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 