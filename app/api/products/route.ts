export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { deleteProductInvoice, getInvoiceProductByEmail, initialiseProductInvoice } from "@/app/actions/productActions";
import { getCurrentUser } from "@/app/utils/authClient";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const products = await getInvoiceProductByEmail(user.email);
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Get products error:", error);
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
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (name.trim().length > 20) {
      return NextResponse.json({ error: "Name must be 20 characters or less" }, { status: 400 });
    }

    const result = await initialiseProductInvoice(user.email, name.trim());
    
    if (!result) {
      return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Create products error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// export async function PUT(request:NextRequest){
//   try {
//     const {product} = await request.json()

//     if (!product.id) {
//       return NextResponse.json({ error: "product ID is required" }, { status: 400 });
//     }
// //
//     const result = await updatedProducts(product);

//     return NextResponse.json(result, {status:201})
//   } catch (error) {
//     console.error("update products error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json({ error: "product id is required" }, { status: 400 });
    }

    await deleteProductInvoice(productId);

    return NextResponse.json({message:"product deleted successfully"}, { status: 200 });
  } catch (error) {
    console.error("delete products error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}