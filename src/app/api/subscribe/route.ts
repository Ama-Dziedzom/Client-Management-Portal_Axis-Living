import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { email, firstName } = await req.json();

        // Validate the email format server-side — return 400 if invalid
        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { success: false, message: 'Invalid email address' },
                { status: 400 }
            );
        }

        const API_KEY = process.env.MAILCHIMP_API_KEY;
        const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
        const API_SERVER = process.env.MAILCHIMP_API_SERVER;

        if (!API_KEY || !AUDIENCE_ID || !API_SERVER) {
            console.error('Mailchimp environment variables are missing');
            return NextResponse.json(
                { success: false, message: 'Something went wrong. Please try again.' },
                { status: 500 }
            );
        }

        const url = `https://${API_SERVER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`;

        const data = {
            email_address: email,
            // status: "subscribed" = single opt-in (immediate)
            // status: "pending" = double opt-in (confirmation email sent first)
            status: "subscribed",
            merge_fields: {
                FNAME: firstName || ""
            },
            tags: ["lookbook-signup"]
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (response.ok) {
            return NextResponse.json({ success: true, message: "Subscribed successfully" });
        }

        // Handle the case where the member already exists
        if (responseData.title === "Member Exists") {
            return NextResponse.json({
                success: false,
                alreadySubscribed: true,
                message: "You're already on the list!"
            });
        }

        // Never expose the API key in error messages or responses
        return NextResponse.json(
            { success: false, message: "Something went wrong. Please try again." },
            { status: response.status }
        );

    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}
