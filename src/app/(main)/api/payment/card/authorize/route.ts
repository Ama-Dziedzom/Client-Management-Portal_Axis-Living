import { NextResponse } from 'next/server';
import {
    authorizeChargeWithPin,
    authorizeChargeWithOtp,
    encryptField,
    generateNonce,
} from '@/lib/flutterwave';

export async function POST(req: Request) {
    try {
        const { chargeId, type, pin, otp } = await req.json();

        if (!chargeId || !type) {
            return NextResponse.json({ success: false, message: 'Missing chargeId or type' }, { status: 400 });
        }

        let result;

        if (type === 'pin') {
            if (!pin) return NextResponse.json({ success: false, message: 'Missing pin' }, { status: 400 });
            const encKey = process.env.FLUTTERWAVE_ENCRYPTION_KEY;
            if (!encKey) throw new Error('FLUTTERWAVE_ENCRYPTION_KEY is not set');
            const nonce = generateNonce();
            const encryptedPin = encryptField(pin, encKey, nonce);
            result = await authorizeChargeWithPin(chargeId, encryptedPin, nonce);
        } else if (type === 'otp') {
            if (!otp) return NextResponse.json({ success: false, message: 'Missing otp' }, { status: 400 });
            result = await authorizeChargeWithOtp(chargeId, otp);
        } else {
            return NextResponse.json({ success: false, message: `Unsupported authorization type: ${type}` }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            status: result.data?.status,
            nextAction: result.data?.next_action ?? null,
        });
    } catch (error) {
        console.error('Card authorization error:', error);
        return NextResponse.json(
            { success: false, message: error instanceof Error ? error.message : 'Authorization failed' },
            { status: 500 },
        );
    }
}
