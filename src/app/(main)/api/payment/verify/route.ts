import { NextResponse } from 'next/server';
import { getCharge } from '@/lib/flutterwave';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const chargeId = searchParams.get('charge_id');

    if (!chargeId) {
        return NextResponse.json({ success: false, message: 'Missing charge_id' }, { status: 400 });
    }

    try {
        const charge = await getCharge(chargeId);
        return NextResponse.json({
            success: true,
            status: charge.data?.status,
            reference: charge.data?.reference,
        });
    } catch (error) {
        console.error('Payment verify error:', error);
        return NextResponse.json({ success: false, message: 'Failed to verify payment' }, { status: 500 });
    }
}
