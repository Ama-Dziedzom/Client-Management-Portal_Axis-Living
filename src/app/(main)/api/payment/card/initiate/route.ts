import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import {
    createCustomer,
    createCardPaymentMethod,
    createCharge,
    encryptField,
    generateNonce,
} from '@/lib/flutterwave';

export async function POST(req: Request) {
    try {
        const { name, email, phone, cardNumber, expiryMonth, expiryYear, cvv, amount, currency } = await req.json();

        if (!name || !email || !cardNumber || !expiryMonth || !expiryYear || !cvv || !amount || !currency) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        const encKey = process.env.FLUTTERWAVE_ENCRYPTION_KEY;
        if (!encKey) throw new Error('FLUTTERWAVE_ENCRYPTION_KEY is not set');

        const nonce = generateNonce();
        const encrypted = {
            cardNumber: encryptField(cardNumber.replace(/\s/g, ''), encKey, nonce),
            expiryMonth: encryptField(expiryMonth, encKey, nonce),
            expiryYear: encryptField(expiryYear, encKey, nonce),
            cvv: encryptField(cvv, encKey, nonce),
        };

        const customer = await createCustomer(email, name, phone);
        const customerId = customer.data?.id;
        if (!customerId) throw new Error('Failed to create customer');

        const paymentMethod = await createCardPaymentMethod(
            encrypted.cardNumber,
            encrypted.expiryMonth,
            encrypted.expiryYear,
            encrypted.cvv,
            nonce,
            customerId,
        );
        const paymentMethodId = paymentMethod.data?.id;
        if (!paymentMethodId) throw new Error('Failed to create card payment method');

        const reference = `ALV-${Date.now()}-${randomBytes(4).toString('hex')}`;
        const charge = await createCharge(customerId, paymentMethodId, amount, currency, reference);

        return NextResponse.json({
            success: true,
            chargeId: charge.data?.id,
            reference,
            status: charge.data?.status,
            nextAction: charge.data?.next_action ?? null,
        });
    } catch (error) {
        console.error('Card payment initiation error:', error);
        return NextResponse.json(
            { success: false, message: error instanceof Error ? error.message : 'Failed to initiate card payment' },
            { status: 500 },
        );
    }
}
