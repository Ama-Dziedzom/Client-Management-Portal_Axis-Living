import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function POST(req: Request) {
    const verifHash = req.headers.get('verif-hash');
    const secret = process.env.FLUTTERWAVE_WEBHOOK_SECRET;

    // Flutterwave sends the secret hash as a plain string — direct comparison only
    if (!secret || verifHash !== secret) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.text();
    const event = JSON.parse(body);

    if (event.event === 'charge.completed' && event.data?.status === 'succeeded') {
        const reference = event.data.reference as string;

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const db = getSupabase() as any;
            await db
                .from('bookings')
                .update({ status: 'confirmed', payment_reference: reference })
                .eq('payment_reference', reference)
                .eq('status', 'pending_payment');
        } catch (err) {
            console.error('Webhook Supabase update error:', err);
        }
    }

    return NextResponse.json({ received: true });
}
