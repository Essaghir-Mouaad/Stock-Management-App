export const runtime = "nodejs";
import { NextRequest, NextResponse } from 'next/server';
import { getProductsById } from '@/app/actions/productActions';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const productData = await getProductsById(params.id);
        return NextResponse.json(productData);
    } catch (error) {
        console.error('Error fetching product data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch product data' },
            { status: 500 }
        );
    }
} 